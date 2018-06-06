import React from 'react'
import {View, TextInput, Alert, ScrollView} from 'react-native'
import {FormLabel, FormInput, Text, Button, Divider} from 'react-native-elements'

class AssignmentWidget extends React.Component {
    static navigationOptions = {title: 'Create an Assignment'};

    constructor(props) {
        super(props);
        this.state = {
            lessonId: 1,
            redisplayId: 1,
            name: 'Title goes here',
            description: 'Description goes here.',
            points: 0,
            link: '',
            file: '',
            answer: '',
            preview: false
        };
        this.preview = this.preview.bind(this);
        this.previewOff = this.previewOff.bind(this);
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const lessonId = navigation.getParam("lessonId");
        const redisplayId = navigation.getParam("redisplayId");

        this.setState({
            lessonId: lessonId,
            redisplayId: redisplayId
        });
    }

    preview() {
        this.setState({preview: true});
    }

    previewOff() {
        this.setState({preview: false});
    }

    updateForm(newState) {
        this.setState(newState);
    }

    cancel() {
        this.props.navigation.navigate('WidgetList',
            {
                lessonId: this.state.lessonId,
                redisplayId: this.state.redisplayId + 1
            });
    }

    submit() {
        let assignment = {
            name: this.state.name,
            description: this.state.description,
            points: this.state.points.toString(),
            widgetType: "Assignment"
        };
        return fetch("http://localhost:8080/api/lesson/" + this.state.lessonId + "/assignment", {
            body: JSON.stringify(assignment),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(function (response) {
            return response.json();
        }).then(() => this.cancel());
    }

    render() {
        return (
            <ScrollView>
                {!this.state.preview &&
                <View>
                    <FormLabel>Title</FormLabel>
                    <FormInput onChangeText={
                        text => this.updateForm({name: text})
                    }
                               placeholder={this.state.name}
                               value={() => {
                                   if (this.state.name === 'Title goes here') {
                                       return '';
                                   } else {
                                       return this.state.name;
                                   }
                               }}/>

                    <FormLabel>Description</FormLabel>
                    <View style={{padding: 20}}>
                        <TextInput onChangeText={
                            text => this.updateForm({description: text})
                        }
                                   multiline={true}
                                   style={{backgroundColor: 'white', padding: 10}}
                                   placeholder={this.state.description}
                                   value={() => {
                                       if (this.state.description === 'Description goes here.') {
                                           return '';
                                       } else {
                                           return this.state.name;
                                       }
                                   }}/>
                    </View>

                    <FormLabel>Points</FormLabel>
                    <FormInput onChangeText={
                        text => this.updateForm({points: text})
                    }
                               value={this.state.points.toString()}/>
                    <Button title="Preview" onPress={this.preview}/>
                </View>}
                {this.state.preview &&
                <View>
                    <Text h2 style={{backgroundColor: 'grey', padding: 20}}>{this.state.name}</Text>
                    <Text h2 style={{padding: 20}}>Points: {this.state.points}</Text>
                    <Text style={{paddingLeft: 20, paddingRight: 20}}>{this.state.description}</Text>
                    <Divider style={{
                        backgroundColor:
                            'black'
                    }}/>
                    <Text h2 style={{paddingLeft: 20, paddingRight: 20}}>Essay Answer</Text>
                    <View style={{padding: 20}}>
                        <TextInput multiline={true}
                                   style={{backgroundColor: 'white', padding: 10}}
                                   numberOfLines={4}/>
                    </View>
                    <View style={{padding: 20}}>
                        <Button backgroundColor="blue"
                                color="white"
                                title="Upload file"
                                style={{width: 200}}/>
                        <Text style={{padding: 20}}>No file chosen</Text>
                    </View>
                    <Divider style={{
                        backgroundColor:
                            'black'
                    }}/>
                    <Text h2 style={{paddingLeft: 20, paddingRight: 20}}>Submit a link</Text>
                    <View style={{padding: 20}}>
                        <TextInput multiline={false}
                                   style={{backgroundColor: 'white', padding: 10}}/>
                    </View>
                    <Button title="Back to Editing" onPress={this.previewOff}/>
                </View>
                }
                <Button backgroundColor="red" title="Cancel" onPress={this.cancel}/>
                <Button backgroundColor="blue" title="Submit" onPress={this.submit}/>
            </ScrollView>
        )
    }
}

export default AssignmentWidget;