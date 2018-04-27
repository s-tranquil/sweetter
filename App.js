import React, { Component } from 'react';
import { Text } from "react-native";
// import { Text, Screen, NavigationBar, ListView, View, ImageBackground, Divider, Tile, Title, Subtitle } from '@shoutem/ui';
import request from "superagent";
import { consumerKey, consumerSecretKey } from "./tokens";
import { Base64 } from "js-base64";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "not fetched"
        };
    }

    componentDidMount() {
        const credentials = `${encodeURIComponent(consumerKey)}:${encodeURIComponent(consumerSecretKey)}`;
        const credentialsBase64 = Base64.btoa(credentials);


        request
            .post('https://api.twitter.com/oauth2/token')
            .send({ grant_type: "client_credentials" }) // sends a JSON post body
            .set("Authorization", `Basic ${credentialsBase64}`)
            .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
            .set("accept-encoding", "")
            .end((err, res) => {
                const accessToken = JSON.parse(res.text).access_token;
                this.setState({data: accessToken});
            });
    }


    render() {
        return(
            <React.Fragment>
                <Text>{"\n\n"}</Text>
                <Text>{this.state.data}</Text>
            </React.Fragment>
        )

        // const restaurants = this.state.restaurants;
        
        // return (
        //     <Screen>
        //         <NavigationBar
        //             title="Tweets"
        //             styleName="inline"
        //         />
        //         <ListView
        //             data={restaurants}
        //             renderRow={this.renderRow}
        //         />
        //     </Screen>
        // );
    }
}