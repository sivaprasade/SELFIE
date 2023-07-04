export default function sendEmail(tomail, tosubject, totext) {
console.log("Seding Request to Selfie Mail service for adding new task ");

fetch("http://localhost:8080/send_mail", {
    method: "post",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        from: "noreply@selfie.com",
        to: tomail,
        subject: tosubject,
        text: totext
    })
})
    .then((response) => response.json())
    .then((json) => {
        console.log("Selfie Mail response : ", json);
    });
}

export function completedEmail(tomail1, tosubject1, totext1) {
console.log("Seding Request to Selfie Mail service for completed task ");

fetch("http://localhost:8080/send_completed_mail", {
    method: "post",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        from: "noreply@selfie.com",
        to: tomail1,
        subject: tosubject1,
        text: totext1
    })
})
    .then((response) => response.json())
    .then((json) => {
        console.log("Selfie Mail response : ", json);
    });
}
export function deletedEmail(tomail2, tosubject2, totext2) {
console.log("Seding Request to Selfie Mail service for deleted task ");

fetch("http://localhost:8080/send_deleted_mail", {
    method: "post",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        from: "noreply@selfie.com",
        to: tomail2,
        subject: tosubject2,
        text: totext2
    })
})
    .then((response) => response.json())
    .then((json) => {
        console.log("Selfie Mail response : ", json);
    });
}
export function dueEmail(tomail3, tosubject3, totext3) {
    console.log("Seding Request to Selfie Mail service for due task ");
    
    fetch("http://localhost:8080/send_due_mail", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
        body: JSON.stringify({
            from: "noreply@selfie.com",
            to: tomail3,
            subject: tosubject3,
            text: totext3
        })
    })
        .then((response) => response.json())
        .then((json) => {
            console.log("Selfie Mail response : ", json);
        });
    }
    