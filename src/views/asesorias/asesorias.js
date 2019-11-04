import React, { Component } from 'react';
import { FlatList, StyleSheet, View ,Image, ImageBackground, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Text, ListItem, Divider} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';


//TODO: Cuando se haga el fetch desde el back se debe rescatar la asesoria_id del respectivo médico
let room = null;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQyLCJpYXQiOjE1NzI4MzMxMjN9.KKYvZ6mjkLero0gI-Huy3dEkFCZeSU9S0mUl2nWm8Dg'
const agendada = [
    {
        name: '<Fecha>',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: '<Nombre médico>',
        hora: '<Hora>',
        asesoria_id: 'someId'
    },
]

export default class AsesoriasScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
        }

        this.messageHandler = this.messageHandler.bind(this);
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('didFocus', () => this.componentDidFocus()),
          ];
        this.props.screenProps.socket.setHandler(this.messageHandler)
    }

    componentDidFocus() {
        this.props.screenProps.socket.setHandler(this.messageHandler)
    }

    requestAsesoria(id) {
        
        // TODO: Descomentar scripts oficiales de abajo y borrar lo de arriba
        room = subscribeToRoom(this.props.screenProps.socket, 'asesoria:'+id, token);

        room.emit('message', {
            type: 'asesoria:request',
            data: ''
        })
    }



    messageHandler ( message ) {
        const {type, data} = message;
        switch (type) {
            case 'asesoria:start':
                this.props.navigation.navigate("videollamada");
            default:
              console.log("Default case")
            break;
          }
    }
    

    render() {
        const { search } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>
                        Lista de Doctores
                    </Text> 
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>
                            Disponible
                        </Text> 
                        {
                            agendada.map((l, i) => (
                                <View>
                                    <ListItem
                                        onPress={() => this.requestAsesoria(l.asesoria_id)}
                                        Component={TouchableOpacity}
                                        rightIcon= {{name:"keyboard-arrow-right", size:25, color:'#BDC3C7' }}
                                        key={i}
                                        titleStyle={styles.itemTitleAgendada}
                                        subtitleStyle={styles.itemSubtitle}
                                        leftAvatar={{ source: { uri: l.avatar_url } }}
                                        title={l.name}
                                        subtitle={l.subtitle}
                                        rightTitle={l.hora}
                                        rightTitleStyle={styles.itemTitleRight}
                                    />
                                    <Divider style={{ backgroundColor: '#BDC3C7' }} />
                                </View>
                            ))
                        } 
                    </View>
                </ScrollView>         
            </View>
        );
    }
}

const subscribeToRoom = (sc, room_id, token) => {
    if ( !sc.hasConnection ) {
        sc.connect(token);
    }

    let room = sc.ws.getSubscription(room_id);
    sc.topic = room_id;
    if (!room) {
        return sc.subscribe(room_id);    
    } else {
        return room;
    }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 40
  },
  title:{
    color:'#66696B', 
    fontWeight: 'bold', 
    fontSize: 22, 
    padding: 14
  },
  subtitle:{
    color:'#909090',
    fontWeight: 'bold', 
    fontSize: 17, 
    padding: 14
  },
  section:{
      paddingTop: 14
  },
  itemTitle:{
      color: '#707171',
      fontWeight:'bold',
      fontSize:14
  },
  itemSubtitle:{
      color: '#707171',
      fontSize:13,
      paddingTop:3
  },
  itemTitleAgendada:{
    color: '#FF9F1C',
    fontWeight:'bold',
    fontSize:14
  },
  itemTitleRight:{
    color: '#A3A3A3',
    fontSize:14,
    textAlignVertical:'top',
  },
});
