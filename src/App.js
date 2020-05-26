import React from "react";

import "./App.css";

import {
  Card,
  Icon,
  Input,
  Image,
  Grid,
  Container,
  Header,
} from "semantic-ui-react";

import axios from "axios";

import ScrollToBottom from "react-scroll-to-bottom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionID: "",
      message: "",
      onlineUsers: 0,
      chat: [
        {
          type: "messageTo",
          messages: [
            {
              response_text: "text",
              text: "Hi, I'm Saranraj !!, What's your name ?",
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    axios
      .post("https://chatwithsaran.herokuapp.com/createSession")
      .then((response) => {
        this.setState({
          sessionID: response.data.session_id,
        });
      });
  }
  submit = () => {
    if (this.state.message.trim() !== "") {
      var tempState = this.state.chat;
      var data = {};
      data.type = "messageFrom";
      data.messages = [];
      data.messages.push(this.state.message);

      tempState.push(data);
      this.setState({
        chat: tempState,
        message: "",
      });

      axios
        .post("https://chatwithsaran.herokuapp.com/getResponse", {
          message: this.state.message,
          sessionID: this.state.sessionID,
        })
        .then((response) => {
          var data = {};
          data.type = "messageTo";
          data.messages = [];
          response.data.output.generic.map((text) => {
            data.messages.push(text);
          });
          var tempState = this.state.chat;
          tempState.push(data);
          this.setState({
            chat: tempState,
          });
        });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  keyPress = (e) => {
    if (e.keyCode == 13) {
      this.submit();
    }
  };
  render() {
    return (
      <div>
        <Container>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Card className="left-card">
                  <Card.Content header="Example Questions"></Card.Content>
                  <Card.Content>
                    <p className="para">1. Show some of your projects ?</p>
                    <p className="para">2. Where do you work ?</p>
                    <p className="para">3. Are you a student ?</p>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card className="main-card">
                  <Card.Content header={"Chat with my bot"} />
                  <Card.Content>
                    <ScrollToBottom>
                      <div className="message-body">
                        {this.state.chat.map((chat, index) => {
                          if (chat.type === "messageFrom") {
                            return (
                              <div class="wrapperRight" key={index}>
                                <div className="messageFrom">
                                  <p>{chat.messages[0]}</p>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div>
                                {chat.messages.map((val, index) => {
                                  return (
                                    <div className="wrapperLeft">
                                      <Grid columns={2}>
                                        <Grid.Row>
                                          <Grid.Column width={4}>
                                            <Image
                                              src={
                                                "https://media-exp1.licdn.com/dms/image/C5103AQHYiaxy3Y18Ug/profile-displayphoto-shrink_200_200/0?e=1596067200&v=beta&t=o5PMun1q-ukWFCCtZnY3agKfZ5_xrRPBijCsuIN2uLY"
                                              }
                                              className="image"
                                            />
                                          </Grid.Column>
                                          <Grid.Column width={12}>
                                            <div className="messageTo">
                                              <p>{val.text}</p>
                                            </div>
                                          </Grid.Column>
                                        </Grid.Row>
                                      </Grid>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </ScrollToBottom>
                  </Card.Content>
                  <Card.Content extra>
                    <Input
                      value={this.state.message}
                      placeholder="Enter message here..."
                      className="input-text"
                      onChange={this.handleChange}
                      onKeyDown={this.keyPress}
                      name="message"
                      icon={
                        <Icon
                          name="send"
                          onClick={this.submit}
                          inverted
                          circular
                          link
                        />
                      }
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
