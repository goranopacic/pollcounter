<template>
    <div>
        <b-row align-h="center" class="mt-5">
            <ul id="toplist list-group">
            <li 
                class="list-group-item"
                v-for="(person, index) in sortedArrayPoints(people)"
                :key="index"
            >
                <span :class="{'win': index==0}">
                    {{index+1 + '.'}} {{ person.nickname }} {{ person.points }} 
                </span>
                
            </li>
            </ul>
        </b-row>
    </div>
</template>

<script>

import { API } from 'aws-amplify'

export default {
    data() {
        return {
            apiPeopleName: 'peopleAPI',
            people: []
        }
    },
    mounted () {
        this.loadPeople();
    },
    methods: {
        loadPeople: async function() {
            const response = await API.get(this.apiPeopleName, '/people/all')
            this.people = response
            console.log(response)
        },
        sortedArrayPoints: function(array) {
            return _.orderBy(array,'points','desc');
        },
    },
}
</script>

<style scoped>
.win {
    font-size: 20px;
    font-weight: bold;
}
</style>