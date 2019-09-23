<template>
    <div>
    <b-row align-h="center" class="mt-5">
        <ul id="list-group example-1">
          <li class="list-group-item" v-for="question in sortedArray(questions)">

            {{ question.title }}  
            
                <ul id="example-2 list-group">
                <li class="list-group-item" v-for="option in sortedArray(question.options)">
                  {{ option.title }} {{ question.questionid }} {{ option.optionId }}
                  <b-button size="sm" variant="primary" @click="answer(question.title,question.questionid,option.optionId,true,option.points)">Button</b-button>
                </li>
              </ul>

          </li>
        </ul>
      </b-row>

      <!-- <b-row align-h="center" class="mt-5">
        <ul id="toplist">
          <li v-for="person in sortedArrayPoints(people)">
            {{ person.nickname }} {{ person.points }} 
          </li>
        </ul>
      </b-row> -->
    </div>
</template>

<script>
    import { API } from 'aws-amplify'
    export default {
        data() {
            return {
                apiName: 'pollCounterAPI',
                // apiPeopleName: 'peopleAPI',
                apiQuestionName: 'questionAPI',
                apiAnswerName: 'answerAPI',
                //   nickname: this.$cookie.get('nickname-5'),
                uuid: this.$cookie.get('uuid-5'),
                points: 0,
                questions: [],
                // people: []
            }
        },
        mounted () {
            this.loadQuestions();
        },
        methods: {
            // loadPeople: async function() {
            //     const response = await API.get(this.apiPeopleName, '/people/all')
            //     this.people = response
            //     console.log(response)
            // },
            loadQuestions: async function() {
                const response = await API.get(this.apiQuestionName, '/question/all')
                this.questions = response
                console.log(response)
            },
            // sortedArrayPoints: function(array) {
            //     return _.orderBy(array,'points','desc');
            // },
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

                // this.loadPeople()
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>