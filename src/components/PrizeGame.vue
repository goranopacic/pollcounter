<template>
    <div class="pl-3 pr-3">
        <b-row>
            <b-col>
                <b>GAME OVER<br/><br/>
                Pick your t-shirts at Community booth
                <br/><br/><br/><br/>
                 book - Serverless Applications with Node.js by Slobodan Stojanovic and Aleksandar Simovic - AWS Serverless Heroes<br/>
                10 T-shirts with AWS logo<br/>
                correct answer 10 points, wrong answer 0, second attempt correct answer - 5 points, time to answer calculated. Game ends at 1:30 PM</b><br/><br/><br/><br/>
            </b-col>
        </b-row>
      <b-row v-for="question in sortedArray(questions)" :key="question.title" class="mt-1">
        <b-col class="question-section">
            <b>{{ question.title }} </b>
            <ul id="example-2 list-group">
                <li class="list-group-item question-list p-1" v-for="(option, index) in sortedArray(question.options)" :key="index">
                  {{ option.title }} 
                  <!-- {{ question.questionid }} {{ option.optionId }} -->
                  <!-- getAnswerClass(option) -->
                  <b-button 
                  :class="{'selected-true': option.points1 == 'success',
                     'selected-false': option.points1 == 'invalid',
                     'selected': option.points1 == 'default' }"
                  class="ml-1 submit-btn" size="sm" variant="default"
                     @click="selectOption(option, question.options);answer(question.title,question.questionid,option.optionId,true,option.points)"
                  >
                    Submit
                  </b-button>
                </li>
              </ul>
        </b-col>
      </b-row>
    </div>
</template>

<script>
    import { API } from 'aws-amplify'
    export default {
        data() {
            return {
                apiName: 'pollCounterAPI',
                apiQuestionName: 'questionAPI',
                apiAnswerName: 'answerAPI',
                uuid: this.$cookie.get('uuid-10'),
                points: 0,
                questions: [],
                answers: []
            }
        },
        mounted () {
            // this.loadQuestions();
            this.loadAnswers();
        },
        methods: {
            // getAnswerClass(option) {
            //     // debugger;
            //     if (option.points1 == 'success') {
            //         return 'selected-true'
            //     } else if (option.points1 == 'invalid') {
            //         console.log('falseee')
            //         return 'selected-false'
            //     } else {
            //         return 'selected'
            //     }
            // },
            loadQuestions: async function() {
                let response = await API.get(this.apiQuestionName, '/question/all')
                
                for (let i in response) {
                    let questionOptions = response[i].options
                    let questionId = response[i].questionid
                    // debugger

                    for (let a in this.answers) {
                        let answer = this.answers[a]
                        if (answer.questionId == questionId) {

                            for (let n in questionOptions) {
                                let option = questionOptions[n]
                                if (answer.optionId == option.optionId) {
                                    
                                    let points = answer.points
                                    console.log(questionId)
                                    console.log(points)
                                    if (points > 0 || points == 0) {
                                        if (points > 0) {
                                            // points 10
                                            questionOptions[n]['points1'] = 'success'
                                        } else {
                                            // points 0
                                            console.log('points 0')
                                            questionOptions[n]['points1'] = 'invalid'
                                        }
                                    } else {
                                        // no answer
                                        questionOptions[n]['points1'] = 'default'
                                    }

                                }
                            }
                        }
                    }
                }
                
                this.questions = response
                
            },
            drawAnswers: async function() {
                for (let i in this.questions) {
                    let questionOptions = this.questions[i].options
                    let questionId = this.questions[i].questionid
                    // debugger

                    for (let a in this.answers) {
                        let answer = this.answers[a]
                        if (answer.questionId == questionId) {

                            for (let n in questionOptions) {
                                let option = questionOptions[n]
                                if (answer.optionId == option.optionId) {
                                    
                                    let points = answer.points
                                    console.log(questionId)
                                    console.log(points)
                                    if (points > 0 || points == 0) {
                                        if (points > 0) {
                                            // points 10
                                            questionOptions[n]['points1'] = 'success'
                                        } else {
                                            // points 0
                                            console.log('points 0')
                                            questionOptions[n]['points1'] = 'invalid'
                                        }
                                    } else {
                                        // no answer
                                        questionOptions[n]['points1'] = 'default'
                                    }

                                }
                            }
                        }
                    }
                }
            },
            loadAnswers: async function() { 
                const answer = {
                    body: {
                        "person" : this.uuid
                    }
                }

                const response = await API.post(this.apiAnswerName, '/answer/person', answer)
                //const response = {}

                this.answers = response
                this.loadQuestions()
            },
            sortedArray: function(array) {
                return _.orderBy(array,'ordinalNo','asc');
            },
            answer: async function(questionTitle, questionId, optionId, answerValue, answerPoints) {

                var containsAnswer = false;

                for (let a in this.answers) {
                    console.log("Q: " + this.answers[a].questionId)
                    if (this.answers[a].questionId == questionId) {
                        if (answerPoints == 10) {
                            answerPoints = 5;
                        }
                        containsAnswer = true;
                    }
                }

                const answer = {
                    body: {
                    "person" : this.uuid,
                    "questionId" : questionId,
                    "optionId" : optionId,
                    "points" : answerPoints
                    }
                }

                const response = await API.post(this.apiAnswerName, '/answer',answer)
                this.points = response.data
                this.$parent.points = response.data

                if (!containsAnswer) {
                    this.answers.push({
                    "person" : this.uuid,
                    "questionId" : questionId,
                    "optionId" : optionId,
                    "points" : answerPoints
                    })
                    drawAnswers();
                }
            },
            selectOption(option, options) {
                console.log(options)
                for (let i in options) {
                    options[i]['points1'] = 'default'
                }

                // debugger;
                if (option.points > 0) {
                    option['points1'] = 'success'
                } else {
                    option['points1'] = 'invalid'
                }
                
                this.$forceUpdate();
            }
        },
    }
</script>

<style scoped>
.question-list {
    border: none !important;
}

.submit-btn {
    background-color: #ddd;
}

.selected-true {
    background-color: green;
    color: white;
}

.selected-false {
    background-color: red;
    color: white;
}
</style>