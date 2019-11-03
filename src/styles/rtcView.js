import { StyleSheet } from "react-native";

const rtcView = StyleSheet.create({
  userVideo:{
    backgroundColor: 'black',
    position:"absolute",
    borderRadius:80,
    left: "55%",
    top: "65%",
    width: "40%",
    height: "28%",
    overflow:'hidden',
    zIndex:2
  },
  remoteVideo:{
    backgroundColor: 'black',
    borderColor: 'black',
    flex:1,
    borderWidth: 5,
    borderRadius: 20,
  }
});

export default rtcView;