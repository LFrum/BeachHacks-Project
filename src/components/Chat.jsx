import React, { Component } from 'react';
import Messages from "./Messages.jsx";
import Input from "./Input.jsx"
import App from '../App.css'
/**
 * 
 */
class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            member: {
            username: this.randomName(),
            color: this.randomColor(),
            }
        }
    
        //SETUP SCALE DRONE CONNECTION
        this.drone = new window.Scaledrone("Jh23ZEsBY5q1UjuJ", {
            data: this.state.member
        });
    
        this.drone.on('open', error => {
            if (error) {
            return console.error(error);
            }
            const member = {...this.state.member};
            member.id = this.drone.clientId;
            this.setState({member});
        });
        
        const room = this.drone.subscribe("observable-room");
    
        //Suscribe to data event of room to know when messages arrive
        room.on('data', (data, member) => {
            const messages = this.state.messages;
            messages.push({member, text: data});
            this.setState({messages});
        });
    }

    componentDidMount() {};
    
    randomName(){
      const adjectives = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
      const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return adjective + noun;
    };
    
    randomColor(){
      return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    };
  
    onSendMessage = (message) => {
      this.drone.publish({
        room: "observable-room",
        message
      });
    }
  
    render() {
      return (
        <React.Fragment>
            <Messages
              messages={this.state.messages}
              currentMember={this.state.member}
            />
  
            <Input
              onSendMessage={this.onSendMessage}
            />
        </React.Fragment>
      );
    }
    
}
 
export default Chat;