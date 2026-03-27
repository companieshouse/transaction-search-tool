class TimelineModel {
    date: string;
    event: string;
    location: string;
    userLogin: string;

    public toString(): string {
        return `TimelineModel: ${JSON.stringify(this.getModel())}`;
    }

    public getModel(): object {
        return {
            "date" : this.date,
            "event" : this.event,
            "location" : this.location,
            "userLogin" : this.userLogin,
        };
    }
}

export default TimelineModel;