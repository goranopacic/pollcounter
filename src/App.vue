<template>
  <div id="app" class="hello"><h1>Awsome Day Belgrade 2019</h1>
      <h4>Enter your nickname: <input v-model="nickname" placeholder="enter your nickname" ><b-button size="lg" variant="primary" @click="setnickname(nickname)">Button</b-button></h4>
      <h4>Hi {{ nickname }} {{ uuid }} {{points}}</h4>
    <b-row align-h="center" class="mt-5">
      <ul id="example-1">
        <li v-for="question in sortedArray(questions)">

          {{ question.title }}  
          
              <ul id="example-2">
              <li v-for="option in sortedArray(question.options)">
                {{ option.title }} {{ question.questionid }} {{ option.optionId }}
                <b-button size="lg" variant="primary" @click="answer(question.title,question.questionid,option.optionId,true,option.points)">Button</b-button>
              </li>
            </ul>

        </li>
      </ul>
    </b-row>
  </div>  
</template>

<script>
const uuidv4 = require('uuid/v4');
import { API } from 'aws-amplify'
export default {
  name: 'app',
  data() {
    return {
      apiName: 'pollCounterAPI',
      apiPeopleName: 'peopleAPI',
      apiQuestionName: 'questionAPI',
      apiAnswerName: 'answerAPI',
      nickname: this.$cookie.get('nickname'),
      uuid: this.$cookie.get('uuid-3'),
      points: 0,
      questions: []
    }
  },
  methods: {
    sortedArray: function(array) {
      return _.orderBy(array,'ordinalNo','asc');
    },
    setnickname: async function(nick) {

      if (this.uuid == undefined) {

        const newUuid = uuidv4()
        const init = {
          body: {
            "nickname" : nick,
            "uuid" : newUuid,
            "points" : 0
          }
        }
        const response = await API.put(this.apiPeopleName, '/people', init)

        this.$cookie.set('nickname',nick, { expires: '1Y' })
        this.nickname = nick
        this.$cookie.set('uuid-3',newUuid, { expires: '1Y' })
        this.uuid = newUuid

        this.loadQuestions()

      } else {

        var update = {
          body : {
            Key:{
                "uuid": this.uuid
            },
            UpdateExpression: "set nickname = :nickname",
            ExpressionAttributeValues: {
                ":nickname": nick
            },
            ReturnValues:"UPDATED_NEW"
          }
        };

        const response = await API.post(this.apiPeopleName, '/people', update)

        this.$cookie.set('nickname',nick)
        this.nickname = nick

      }    

      console.log(nick)
      console.log(this.$cookie.get('uuid-3'))
    },
    vote: async function (vote) {
      const init = {
        queryStringParameters: {
          vote
        }
      }
      const response = await API.post(this.apiName, '/votes', init)
      if (vote === 'yes') this.votesYes = response.data.Attributes.votesYes
      if (vote === 'no') this.votesNo = response.data.Attributes.votesNo
    },
    updateVotes: async function () {

      const answer = {
        body: {
          "person" : this.uuid
        }
      }

      const response = await API.get(this.apiPeopleName, '/people/' + this.uuid)
      console.log(response)
      this.points = response[0].points  
    },
    loadQuestions: async function() {
      const response = await API.get(this.apiQuestionName, '/question/all')
      this.questions = response
      console.log(response)
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
    }

  },
  created () {
    if (this.uuid != undefined) {
      this.updateVotes()
      //setInterval(this.updateVotes, 3000)
      this.loadQuestions()
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
