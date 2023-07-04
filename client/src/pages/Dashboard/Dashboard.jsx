import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewTask from "./NewTask";
import { CheckCircledIcon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useOutletContext } from "react-router-dom";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { CircularProgressbar } from 'react-circular-progressbar';
import { addNotif, TaskStatus } from "../../utils/notifSlice";
import {
  collection,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import today from "../../utils/getDate";
import { completedEmail, deletedEmail, dueEmail } from "../../utils/email";
import { Notification } from "../notification/notifcation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState(false);
  const [authData, setAuthData] = useOutletContext(); //read auth data from _applayout.jsx
  const [todaysTasks, loading, error] = useCollection(
    query(
      collection(db, "users/" + authData.uid + "/tasks"),
      where("date", "==", today)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [stats, loading2, error2] = useDocument(
    doc(db, "users/" + authData.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const setCompleted = async (id) => {
    updateDoc(doc(db, "users/" + authData.uid + "/tasks", id), {
      completed: true,
    });
    //the following code will increment the completedTasks count
    const userData = await getDoc(doc(db, "users", authData.uid));
    const completedTasks = userData.data().completedTasks + 1;

    updateDoc(doc(db, "users", authData.uid), {
      completedTasks,
    });
  };
  const deleteTask = async (id) => {
    deleteDoc(doc(db, "users/" + authData.uid + "/tasks", id));
    //the following code will increment the completedTasks count
    const userData = await getDoc(doc(db, "users", authData.uid));
    const deletedTasks = userData.data().deletedTasks + 1;

    updateDoc(doc(db, "users", authData.uid), {
      deletedTasks,
    });
  };
  let tomail1 = authData?.email;
  let tosubject1 = "Task Completed";
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let dateTime = today + ' ' + time;
  //console.log(dateTime);
  // console.log(today);

  // let due_mail_send=()=>{
  //   if(dateTime==today+' 00:00:0'){
  //     let tomail3 = authData?.email;
  //     let tosubject3 = "Task Due";
  //     let totext3 = `Hi ${authData?.displayName}, you have a task due today. Task: ${todaysTasks?.docs[0].data().task} Description: ${todaysTasks?.docs[0].data().desc} Date: ${todaysTasks?.docs[0].data().date}`;
  //     dueEmail(tomail3, tosubject3, totext3);
  //   }
  // }
  // due_mail_send();
  const notifState = useSelector(state => state.notify.events);
  const displayTask = () => {
    return stats && stats.data && stats.data() ?
      (
        <div className="taskCard ">
          <p>Total Tasks : {stats.data().totalTasks}</p>
          <p>Completed Tasks: {stats.data().completedTasks}</p>
          <p>Deleted Tasks: {stats.data().deletedTasks}</p>
          <p>Incompleted Tasks: {stats.data().totalTasks - stats.data().completedTasks}</p>
        </div>
      ) : (
        <>
          <p>There is nothing here.Add some task</p>
        </>
      )
  }
  return (
    <>
       {Notification(notifState)}
      <div className="relative bg-gray-200 dark:bg-gray-800 w-11/12 h-5/6 rounded-2xl grid place-items-center">
        {!newTask && (
          <div
            className="flex items-center absolute right-0 top-0 p-1 px-2 m-3 rounded bg-green-800 hover:bg-green-900 cursor-pointer"
            onClick={() => {
              setNewTask(true);
            }}
          >
            New Task <PlusCircledIcon className="ml-2" />
          </div>
        )}
        {newTask && <NewTask setNewTask={setNewTask} />}

        <div className="w-full break-words">
          <h1 className="p-2 font-bold text-2xl">Today's Task</h1>
          
          {todaysTasks && todaysTasks.empty && <p>There is no task for today :(</p>}
          {todaysTasks && (
            <section className="w-fit max-w-2xl flex flex-wrap whitespace-normal">
              {todaysTasks.docs.map((doc) => (
                <div className="taskCard" key={doc.id}>
                  <span
                    className="text-red-600 hover:text-red-400 cursor-pointer absolute top-0 right-0 p-3"
                    onClick={() => {
                      let tomail2 = authData?.email;
                      let tosubject2 = "Task Deleted";
                      const taskName = doc.data(doc.id).task;
                      let totext2 = "you have deleted a task" + taskName;
                      deleteTask(doc.id)
                      const notifTask = {
                        desc: taskName,
                        id: (notifState ? notifState.length : 0),
                        status: TaskStatus.Delete,
                        read: false,
                      };
                      dispatch(addNotif(notifTask));
                      deletedEmail(tomail2, tosubject2, totext2);
                    }}
                  >
                    <TrashIcon />{" "}
                  </span>
                  <p className="text-lg pb-2">{doc.data().task}</p>
                  <div className="flex items-center">
                    {doc.data().completed === true ? (
                      <span className="taskStatus bg-green-600 dark:bg-green-800/60">
                        Completed
                      </span>
                    ) : (
                      <>
                        <span className="taskStatus bg-red-600 dark:bg-red-800/60">
                          Pending
                        </span>
                        <span
                          className="text-green-600 hover:text-green-400 cursor-pointer absolute top-0 right-0 p-3 mr-7"
                          onClick={() => {
                            const taskName = doc.data(doc.id).task;
                            const notifTask = {
                              desc: taskName,
                              id: (notifState ? notifState.length : 0),
                              status: TaskStatus.Complete,
                              read: false,
                            };
                            dispatch(addNotif(notifTask));
                            let totext1 = "you have completed the task " + taskName;
                            setCompleted(doc.id)
                            completedEmail(tomail1, tosubject1, totext1);
                          }}
                        >
                          <CheckCircledIcon />{" "}
                        </span>
                      </>
                    )}
                    {doc.data().date === "" ? (
                      <p className="bg-gray-900 px-2 text-sm w-max rounded">
                        no due date
                      </p>
                    ) : (
                      <p className="bg-gray-900 px-2 text-sm w-max rounded">
                        {doc.data().date}
                      </p>
                    )}
                  </div>
                  <hr className="opacity-50 my-3" />
                  <p>{doc.data().desc}</p>
                </div>
              ))}
            </section>
          )}
        </div>
        {/* {stats && <span>Document: {JSON.stringify(stats.data())}</span>} */}
        <div>
          <div>
            <h1 className="p-2 text-2xl">Stats</h1>
            {displayTask()}
          </div>
          <div></div>
        </div>
        <div>
          {/* {stats && (
          <div >
            <CircularProgressbar value={Math.round(stats.data().completedTasks / stats.data().totalTasks*100)} text={`${Math.round(stats.data().completedTasks / stats.data().totalTasks*100)}`}/>
            </div>
            )} */}
        </div>
      </div>
    </>
  );
} 
