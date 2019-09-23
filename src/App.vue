<template>
  <div id="app" class="hello"><h1>Awsome Day Belgrade 2019</h1>
    <!-- login -->
    <div v-if="!isLoggedIn" class="mt-5">
      <h4>Enter your nickname: <input ref="nameInput" v-on:keyup.enter="setnickname(nickname)" v-model="nickname" placeholder="nickname">
        <b-button 
          variant="primary"
          class="ml-2 aws-color"
          @click="setnickname(nickname)"
        >
          Set nickname
        </b-button>
      </h4>
    </div>
    
    <!-- content -->
    <div v-if="isLoggedIn">
      <h4 class="mt-4" v-if="isLoggedIn"><span @click="changeNickname">Hi {{ nickname }}!</span></h4>
      <h4><b>Points: {{ points }}</b></h4>


        <div class="mt-4 mb-3">
          <router-link class="p-2 rt-link" to="/agenda">Agenda</router-link>
          <router-link class="p-2 rt-link" to="/prize-game">Game</router-link>
          <router-link class="p-2 rt-link" to="/high-score">Score</router-link>
          <router-link class="p-2 rt-link" to="/aws-ug-belgrade">AWS UG</router-link>
        </div>

        <hr/>
        <router-view></router-view>
    </div>
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
      nickname: this.$cookie.get('nickname-5'),
      uuid: this.$cookie.get('uuid-5'),
      points: 0,
      questions: [],
      people: [],
      isLoggedIn: false,
    }
  },
  methods: {
    // sortedArrayPoints: function(array) {
    //   return _.orderBy(array,'points','desc');
    // },
    // sortedArray: function(array) {
    //   return _.orderBy(array,'ordinalNo','asc');
    // },
   focusInput() {
      this.$refs.nameInput.focus();
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

        this.$cookie.set('nickname-5',nick, { expires: '1Y' })
        this.nickname = nick
        this.$cookie.set('uuid-5',newUuid, { expires: '1Y' })
        this.uuid = newUuid
        this.isLoggedIn = true

        // this.loadQuestions()

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
        this.isLoggedIn = true

      }    

      console.log(nick)
      console.log(this.$cookie.get('uuid-5'))
      this.$router.push('/prize-game').catch(err => {})
    },
    changeNickname() {
      this.uuid = undefined
      this.nickname = ''
      this.points = 0
      this.isLoggedIn = false
    },
    // vote: async function (vote) {
    //   const init = {
    //     queryStringParameters: {
    //       vote
    //     }
    //   }
    //   const response = await API.post(this.apiName, '/votes', init)
    //   if (vote === 'yes') this.votesYes = response.data.Attributes.votesYes
    //   if (vote === 'no') this.votesNo = response.data.Attributes.votesNo
    // },
    // updateVotes: async function () {

    //   const answer = {
    //     body: {
    //       "person" : this.uuid
    //     }
    //   }

    //   const response = await API.get(this.apiPeopleName, '/people/' + this.uuid)
    //   console.log(response)
    //   this.points = response[0].points  
    // },
    // loadQuestions: async function() {
    //   const response = await API.get(this.apiQuestionName, '/question/all')
    //   this.questions = response
    //   console.log(response)
    // },
    // loadPeople: async function() {
    //   const response = await API.get(this.apiPeopleName, '/people/all')
    //   this.people = response
    //   console.log(response)
    // },

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

      this.loadPeople()
    }

  },
  created () {
    if (this.uuid != undefined) {
      this.isLoggedIn = true
      // this.updateVotes()
      //setInterval(this.updateVotes, 3000)
      // this.loadQuestions()
      // this.loadPeople()
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

.rt-link {
  color: black;
}

.rt-link:hover {
  color: black;
}

.router-link-active {
  background-color: #FF9900;
  color: black;
}

.aws-color {
  background-color: #FF9900 !important;
  color: black !important;
  border: 0 !important;
}
</style>
