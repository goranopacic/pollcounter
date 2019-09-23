<template>
    <div class="pl-3 pr-3">
        <b-row>
            <b-col>
                text
            </b-col>
        </b-row>
      <b-row v-for="question in sortedArray(questions)" :key="question.title" class="mt-1">
        <b-col class="question-section">
            <b>{{ question.title }} </b>
            <ul id="example-2 list-group">
                <li class="list-group-item question-list p-1" v-for="(option, index) in sortedArray(question.options)" :key="index">
                  {{ option.title }} 
                  <!-- {{ question.questionid }} {{ option.optionId }} -->
                  <b-button :class="{'selected': option.selected == true}" class="ml-1 submit-btn" size="sm" variant="default"
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
                uuid: this.$cookie.get('uuid-5'),
                points: 0,
                questions: []
            }
        },
        mounted () {
            this.loadQuestions();
        },
        methods: {
            loadQuestions: async function() {
                const response = await API.get(this.apiQuestionName, '/question/all')
                for (let i in response) {
                    let questionOptions = response[i].options
                    for (let n in questionOptions) {
                        questionOptions[n]['selected'] = false
                    }
                }
                this.questions = response
                // console.log(response)
            },
            sortedArray: function(array) {
                return _.orderBy(array,'ordinalNo','asc');
            },
            answer: async function(questionTitle, questionId, optionId, answerValue, answerPoints) {

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
            },
            selectOption(option, options) {
                for (let i in options) {
                    options[i]['selected'] = false
                }
                option['selected'] = true

                // console.log(option)
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

.selected {
    background-color: #146eb4;
    color: white;
}
</style>