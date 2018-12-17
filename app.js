const form = document.getElementById('add-to-list');
const list = document.getElementById('list');


//Getting data
db.collection('todo-list').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        populateList(doc)
    });
})

//Populate the list
function populateList(doc) {
    let li = document.createElement('li');
    let title = document.createElement('span');
    let dateToComplete = document.createElement('span');
    let date = document.createElement('span');
    let cross = document.createElement('div');

    cross.textContent = 'x';

    
    li.setAttribute('data-id', doc.id);
    title.textContent = doc.data().title;
    dateToComplete.textContent = doc.data().dateToComplete;
    date.textContent = doc.data().date;
    
    cross.addEventListener('click', (e) => {
        confirmAction('You sure?');
        e.stopPropagation();
        var id = e.target.parentElement.getAttribute('data-id');
        db.collection('todo-list').doc(id).delete();
    });

    li.appendChild(title);
    li.appendChild(dateToComplete);
    li.appendChild(date);
    li.appendChild(cross);

    list.appendChild(li);

}

//epochToJsDate
function epochToJsDate(date) {
    try {
        var newDate = new Date(date.seconds*1000).toDateString();
        return newDate.substr(0,18);
    } catch (error) {
        console.error(error);
    }
}

// Saving data
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(form.title.value == "" || form.dateToComplete.value == "") {
        let spanError = document.createElement('span');
        spanError.textContent = "You must complete everything before send";
        spanError.setAttribute('class', 'errorText');
        form.appendChild(spanError);
        return;
    }
    var todayDate = new Date(0).setUTCSeconds(Date.now());
    db.collection('todo-list').add({
        title: form.title.value,
        dateToComplete: form.dateToComplete.value,
        date: todayDate
    })
    .then((docRef) => {
        console.log("Document written with id: ", docRef.id);
    })
    .catch((error) => {
        console.error(error);
    });
    form.title.value = "";
    form.dateToComplete.value = "";
})
