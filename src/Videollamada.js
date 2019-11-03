import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  YellowBox
} from 'react-native';
import { 
  mediaDevices,
  RTCView
} from 'react-native-webrtc';
import {
  button,
  container,
  rtcView,
  text
} from './styles';
// import VideoCall from './utils/simple-peer';


YellowBox.ignoreWarnings(['Setting a timer', 'Unrecognized WebSocket connection', 'ListView is deprecated and will be removed']);

/* ==============================
 Global variables
 ================================ */
let pcPeers = {};
let appClass;
let room = null;
/* ==============================
 Class
 ================================ */
class Videollamada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: {},
      remoteStreamUrl: null,
      streamUrl: null,
      initiator: false,
      peer: {},
      full: false,
      connecting: false,
      waiting: true
    }

    this.signalHandler = this.signalHandler.bind(this);
  }

  // videoCall = new VideoCall()
  
  componentDidMount() {
    this.props.screenProps.socket.setHandler(this.signalHandler)
    room = getSubscription(this.props.screenProps.socket, this.props.screenProps.socket.topic)
    this.getReady()
    this.getLocalStream().then( () => {
      room.emit('message', {
        type: 'asesoria:ready',
        data: ''
      });
    });
  }
  
  componentWillUnmount() {
    console.log("Se va a desmontar la videollamada")
  }

  signalHandler ( message ) {
    const {type, data} = message
    switch (type) {
        case 'asesoria:ready' :
          //this.getReady();
        case 'asesoria:signaling':
          this.state.peer.signal(data)
          break;
        default:
          console.log("Default case")
        break;
      }
  }

  getLocalStream = () => {
    return new Promise( (resolve, reject) => {
      const isFront = true;
      const op = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 360,
            minFrameRate: 30,
          },
          facingMode: isFront ? 'user' : 'environment'
        }
      };

      mediaDevices.getUserMedia(op).then( stream => {
        this.setState({ streamUrl: stream.toURL(), localStream: stream })
        resolve();
      });
    });
  }

  switchCamera = () => {
    this.state.localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  };
  
  getReady = () => {
    // this.setState({ connecting: true })
    // const peer = this.videoCall.init(
    //   this.state.localStream,
    //   this.state.initiator
    // )
    // this.setState({peer})
    // // TODO: Se debe adaptar a la nueva lógica del WebSocket
    // peer.on('signal', data => {
    // room.emit('message', {
    //     type: 'asesoria:signaling',
    //     data: data
    //   });
    // });

    // peer.on('stream', stream => {
    //   this.setState({remoteStreamUrl: stream.toURL(), connecting: false, waiting: false});
    // })

    // peer.on('error', function(err) {
    //   console.log(err)
    // })
  }




  // onPress = () => {
  //   this.setState({
  //     status: 'connect',
  //     info: 'Connecting',
  //   });
    
  //   join(this.state.roomID);
  // };
  
  button = (func, text) => (
    <TouchableOpacity style={button.container} onPress={func}>
      <Text style={button.style}>{text}</Text>
    </TouchableOpacity>
  );
  
  render() {
    return (
      <View style={container.style}>
        {/* {this.button(this.switchCamera, 'Cambiar Camera')} */}
        
        <View style={rtcView.userVideo}> 
          <RTCView objectFit='cover' zOrder={1} style={{ flex: 1, backgroundColor: '#424242', }} streamURL={this.state.streamUrl}/> 
        </View>

        {!(this.state.connecting || this.state.waiting) && (
          <View style={rtcView.remoteVideo}> 
            <RTCView objectFit='cover' style={{ flex: 1, backgroundColor: '#424242', }} streamURL={this.state.remoteStreamUrl} /> 
          </View>
        )}
      </View>
    );
  }
}

/* ==============================
 Functions
 ================================ */
 const getSubscription = (sc, room_id) => {

  let room = sc.ws.getSubscription(room_id);

  if (!room) {
      return sc.subscribe(room_id);    
  } else {
      return room;
  }
}

/* ==============================
 Export
 ================================ */
export default Videollamada;
