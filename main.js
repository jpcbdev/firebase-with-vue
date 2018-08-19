
const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
}

firebase.initializeApp(config);

// You need copy your database config up

const dbRef = firebase.database();

const vm = new Vue({
    el: 'main',
    data: {
        name: null,
        message: null,
        chat: [],
        likes: 0
    },
    methods: {

        //Set data {{ unused }}
        setData() {
            dbRef.ref('users/chat_latino/').set({
                id: 1,
                name: 'marquito',
                age: 49
            }).then(console.log('Datos modificados o insertados'));
        },

        // Push message {{ here i use push and before update for catch the id data }}
        pushMessage() {

            dbRef.ref('users/chat_latino/').push({
                id: null,
                name: this.name,
                message: this.message

            }).then((data) => {
                dbRef.ref('users/chat_latino/' + data.key).update({
                    id: data.key
                });
            });
        },

        deleteMessage(key) {
            if (confirm('Can you delete this message?'))
                dbRef.ref('users/chat_latino/' + key).remove();
        },

        // Snap data 
        snapData() {

            const dbRef = firebase.database();
            // Chat snap
            dbRef.ref('users/chat_latino/')
                .on('value', snap => {
                    this.chat = snap.val();
                })

            // Temp 
            dbRef.ref('users/likes')
                .on('value', snap => {
                    this.likes = snap.val();
                })
        },

        // Using transaction
        pushLike() {
            dbRef.ref('users/likes').transaction(function (likes) {
                return likes + 1;
            }, function (error, commited, snapshot) {
                if (error) {
                    console.log(error);
                } else if (!commited) {
                    console.warn('Transaction not commited')
                } else {
                    console.info('Transaction done!')
                }
            })
        }
    }
});
// Loading chat data
vm.snapData();

/* 
Methods:
- on: Listen allways
- once: Listen one time
*/

/*
 Other events:
- child_added: listen only the data added
- child_changed: listen only the data changed
- child_removed: listen only the data removed
- child_moved: listen only the data reorganize
*/
