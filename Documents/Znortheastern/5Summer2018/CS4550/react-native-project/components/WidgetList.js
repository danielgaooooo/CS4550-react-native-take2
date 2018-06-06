import React from 'react'
import {View, Button, ScrollView} from 'react-native'
import {ListItem} from 'react-native-elements'

class WidgetList extends React.Component {
    static navigationOptions = {title: 'Widgets'};

    constructor(props) {
        super(props);
        this.state = {
            widgets: [],
            courseId: 1,
            moduleId: 1,
            lessonId: 1,
            redisplayId: 1
        };
    }

    componentWillReceiveProps(newProps) {
        const {navigation} = this.props;
        const lessonId = navigation.getParam("lessonId");
        this.setState(newProps, () =>
            fetch("http://localhost:8080/api/lesson/" + lessonId + "/widget")
                .then(response => (response.json()))
                .then(widgets => this.setState({widgets})));
    }

    componentDidMount() {
        const {navigation} = this.props;
        const lessonId = navigation.getParam("lessonId");
        this.setState({lessonId: lessonId}, () =>
            fetch("http://localhost:8080/api/lesson/" + lessonId + "/widget")
                .then(response => (response.json()))
                .then(widgets => this.setState({widgets})));
    }

    render() {
        let state = this.state;
        return (
            <ScrollView style={{padding: 15}}>
                <Button title="Create New Assignment"
                        onPress={() => this.props.navigation
                            .navigate('AssignmentWidget', {
                                lessonId: state.lessonId,
                                redisplayId: state.redisplayId
                            })}/>
                {this.state.widgets.map(
                    (widget, index) => (
                        <ListItem
                            onPress={() => {
                                if (widget.widgetType === "Assignment") {
                                    this.props.navigation
                                        .navigate("AssignmentEditor", {
                                            assignmentId: widget.id,
                                            name: widget.name,
                                            description: widget.description,
                                            points: widget.points,
                                            lessonId: state.lessonId
                                        })
                                } else {
                                    this.props.navigation
                                        .navigate("QuestionList", {examId: widget.id})
                                }
                            }
                            }
                            key={index}
                            subtitle={widget.text}
                            title={widget.name}/>))}
            </ScrollView>
        )
    }
}

export default WidgetList;