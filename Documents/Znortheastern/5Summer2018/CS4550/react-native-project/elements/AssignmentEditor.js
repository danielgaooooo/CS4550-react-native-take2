import React from 'react'
import {View, TextInput, Alert, ScrollView} from 'react-native'
import {FormLabel, FormInput, Text, Button, Divider} from 'react-native-elements'

class AssignmentEditor extends React.Component {
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
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const lessonId = navigation.getParam("lessonId");
        const redisplayId = navigation.getParam("redisplayId");
        const assignmentId = navigation.getParam("assignmentId");
        const name = navigation.getParam("name");
        const description = navigation.getParam("description");
        const points = navigation.getParam("points");

        this.setState({
            lessonId: lessonId,
            redisplayId: redisplayId,
            assignmentId: assignmentId,
            name: name,
            description: description,
            points: points
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

    delete() {
        return fetch("http://localhost:8080/api/assignment/" + this.state.assignmentId, {
            method: 'delete'
        }).then(() => this.cancel());
    }

    cancel() {
        this.props.navigation.navigate('WidgetList',
            {
                lessonId: this.state.lessonId,
                redisplayId: this.state.redisplayId + 1
            });
    }

    update() {
        let assignment = {
            name: this.state.name,
            description: this.state.description,
            points: this.state.points.toString(),
            widgetType: "Assignment"
        };
        return fetch("http://localhost:8080/api/assignment/" + this.state.assignmentId, {
            body: JSON.stringify(assignment),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
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
                               value={this.state.name}/>

                    <FormLabel>Description</FormLabel>
                    <View style={{padding: 20}}>
                        <TextInput onChangeText={
                            text => this.updateForm({description: text})
                        }
                                   multiline={true}
                                   style={{backgroundColor: 'white', padding: 10}}
                                   value={this.state.description}/>
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
                <Button backgroundColor="red" title="Delete" onPress={this.delete}/>
                <Button backgroundColor="blue" title="Update" onPress={this.update}/>
            </ScrollView>
        )
    }
}

export default AssignmentEditor;