<template>
    <div class="pl-3 pr-3">
        <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Nickname</th>
                <th scope="col">Points</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(person, index) in people"
                    :key="person.uuid"
                >
                <th scope="row">{{index+1}}</th>
                <td>{{ person.nickname }}</td>
                <td>{{ person.points }}</td>
                </tr>
            </tbody>
        </table>
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
            this.people = this.sortedArrayPoints(response)
            console.log(response)
        },
        sortedArrayPoints: function(array) {
            //return _.orderBy(array,'points','desc');
            return array.sort(byPointsAndTime)
        }
    },
}
function byPointsAndTime(a, b){
    var d = new Date()
    return ((b.points * 1000000000000000) + (d.getTime() - b.timeStart)) - ((a.points * 1000000000000000) + (d.getTime() - a.timeStart)); // sort score desc
}
</script>

<style scoped>
.win {
    font-size: 20px;
    font-weight: bold;
}
</style>