export class Device {
    name: string;
    properties: string;
    type: string;
    enabled: boolean;
    _id: string;
    linked_services: Array<Object>;
    transducers : Array<Object>;
    owner: any;
    location_id : string;

    constructor(name: string,
                properties: string,
                type: string,
                enabled: boolean,
                linked_services: Array<Object>, transducers: Array<Object>) {
        this.name = name;
        this.properties = properties;
        this.type = type;
        this.enabled = enabled;
        this.linked_services = linked_services;
        this.transducers = transducers;
    }
}
