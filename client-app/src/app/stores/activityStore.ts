import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";
import {history} from '../..'
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { createAttendee, setActivityProps } from "../common/util/util";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";



 export default class ActivityStore{


    rootStore:RootStore;

     
     constructor(rootStore: RootStore) {
         // update mobx lite to read observables        

         makeObservable(this);
        this.rootStore = rootStore
        
      }

 
      

    @observable activityRegistry = new Map();
    @observable activity : IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;
    @observable.ref hubConnection : HubConnection | null = null;

    @action createHubConnection = (activityId : string) => {
        this.hubConnection = new HubConnectionBuilder()
          .withUrl('http://localhost:5000/chat', {
            accessTokenFactory: () => this.rootStore.commonStore.token!
          })
          .configureLogging(LogLevel.Information)
          .build();
    
        this.hubConnection
          .start()
          .then(() => console.log(this.hubConnection!.state))
          .then(() => {
              console.log('Attempting to join group');
              this.hubConnection!.invoke('AddToGroup', activityId)
          })
          .catch(error => console.log('Error establishing connection: ', error));
    
        this.hubConnection.on('ReceiveComment', comment => {
          runInAction(() => {
            this.activity!.comments.push(comment)
          })
        })

        this.hubConnection.on('Send', message => {
            // toast.info(message);
            console.log(message)
        })
      };
    
      @action stopHubConnection = () => {
        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
        .then(() => {
            this.hubConnection!.stop()
        })
        .then(() => {
            console.log('Connection stopped')
        })
        .catch(err => console.log(err))
      }


      @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
          await this.hubConnection!.invoke('SendComment', values)
        } catch (error) {
          console.log(error);
        }
      } 





    // @computed get activitiesByDate() {
    //     return this.activities.slice().sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
    // }


    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]){
        const sortedActivities = activities.sort(
            (a,b) => a.date.getTime() - b.date.getTime()
        )
        return Object.entries(sortedActivities.reduce((activities,activity) =>{
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        },{} as {[key: string]:IActivity[]}));
    }

   

    @action loadActivities = async () => {
        this.loadingInitial = true;

        // const user = this.rootStore.userStore.user!;
        try{
            const activities = await agent.Activities.list();
            runInAction( () => {
                activities.forEach((activity) =>{
                    setActivityProps(activity,this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity)
                });
                this.loadingInitial = false;
            })
        }
        catch(error){
            runInAction(() => {                
                this.loadingInitial = false
            })
            console.log(error);
        }           
    }

    @action loadActivity= async (id:string) =>{
        let activity = this.getActivity(id);
        if(activity){
            this.activity = activity;
            return activity;
        }
        else{
            this.loadingInitial = true;
            try{
                activity = await agent.Activities.details(id);
                runInAction(() =>{
                    setActivityProps(activity,this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity)
                    this.loadingInitial = false;
                });
                return activity;

            }
            catch(error){
                console.log(error);
                runInAction(() =>{
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }



    getActivity = (id:string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) =>{
        this.submitting = true;
        try{
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`)
        }
        catch(error){
            runInAction(() => {
                this.submitting = false;
            })
            toast.error('Problem submitting data')
            console.log(error.response);
        }
    }

    @action editActivity = async (activity: IActivity) =>{
        this.submitting = true;
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            })
        }
        catch(error){
        runInAction(() => {
            this.submitting = false;
        })
        toast.error('Problem submitting data')
            console.log(error.response);
        }
    }


    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>,id:string) =>{
        this.submitting = true;
        this.target = event.currentTarget.name;
        try{
            await agent.Activities.delete(id);
           runInAction(() => {            
            this.activityRegistry.delete(id);
            this.submitting = false;
            this.target = '';
           })
        }
        catch(error){
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }


    @action attendActivity = async () =>{
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try{
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if(this.activity)
                {
                    this.activity?.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }

            })
        }catch(error){
            runInAction(() => {
                this.loading = false;                

            })
            toast.error('Problem signing up to activity')
        }

        

    }


    @action cancelAttendance = async () => {
        this.loading = true;
        try{
            await agent.Activities.unattend(this.activity!.id)
            runInAction(() =>{
                if(this.activity)
        {
            this.activity.attendees = this.activity.attendees.filter(a => a.username !== 
                this.rootStore.userStore.user!.username);
                this.activity.isGoing = false;
                this.activityRegistry.set(this.activity.id, this.activity);
                this.loading = false;
        }
            })
        }
        catch(error){
            runInAction(()=>{
                 this.loading = false;
            })
            toast.error('Problem cancelling attendance')
        }
        
        
    }


}

