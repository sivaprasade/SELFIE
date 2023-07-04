import { TaskStatus } from "../../utils/notifSlice";
import { Button, Popover } from "antd";
import { BellIcon } from "@radix-ui/react-icons";
import "./not.css";
export const Notification = (notifState) => {
    
    // const text = <div className=" h-full">
    //     <span className="p-2 font-bold text-2xl">Notifcation</span>
    //     </div>;
    const content = (
        <section className=" txt1 w-fit max-w-2xl flex flex-wrap whitespace-normal">
            <div className="taskCard">
        <div className=" text-lg pb-2" >
            {
                notifState ?
                    <div>
                    <ul>
                        {notifState.map(task => <li>{TaskStatus[task.status]} : {task.desc}</li>)}
                    </ul>
                    <br />
                    </div>
                    : <div>No Notification</div>
            }
        </div>
        </div>
        </section>
    );
    return (
        <div className="flex items-center absolute right-0 top-0 p-1 px-2 m-3 cursor-pointer">
        <Popover   content={content} trigger="click">
            <Button>
                <BellIcon />
            </Button>
        </Popover>
        </div>
    );
}