import * as helpers from '../helpers';

import * as eventstore from 'eventstore';
import { Observable } from 'rxjs/Observable';
import { Event } from './models/event';

export class EventStore {
	
  private es;

  constructor() {
    //this.es = eventstore({ type: 'redis' });
  	this.es = eventstore({
      type: 'mongodb',
      host: 'localhost',                          // optional
      port: 27017,                                // optional
      dbName: 'exataES',                       // optional
      //eventsCollectionName: 'events',             // optional
      //snapshotsCollectionName: 'snapshots',       // optional
      //transactionsCollectionName: 'transactions', // optional
      timeout: 10000,                              // optional
      // maxSnapshotsCount: 3                        // optional, defaultly will keep all snapshots
      // authSource: 'authedicationDatabase',        // optional
      //username: 'EventSource',                // optional
      //password: 'yx3BpMj7gp9hxkTE4zKwpusdixMop1xIHJwQglze3t7P6LCapLruTbfxE9hOQSH'                          // optional
      // url: 'mongodb://user:pass@host:port/db?opts // optional
    });
    this.es.defineEventMappings({
      id: 'id',
      commitStamp: 'stp',
      //commitId: 'commitId',
      //commitSequence: 'commitSequence',
      //streamRevision: 'streamRevision'
    });
		this.es.init();
  }

  // this is an array containing all added events in this commit.
  //console.log(stream.eventsToDispatch); 
  post(event:Event):Observable<Event[]> {
    return new Observable<Event[]>(obs=>{
      this.es.getEventStream('exata', (err, stream) => {
        stream.addEvent(event);
        stream.commit((err, stream) => {
          if(err!=null)
            helpers.cancelObs(obs);
          else
            helpers.okObs(obs);
        });
      });
      return null;
    });
  }

  getFromTo(skip:number=0, limit:number=-1):Observable<Event[]> {
    return new Observable<Event[]>(obs=> {
      this.es.getEvents('exata', skip, limit, (err, evts) => {
        if(err!=null)
          helpers.cancelObs(obs);
        else {
          //if (evts.length === 1000) {
            // just call next to retrieve the next page...
            //evts.next((err, nextEvents)=>{}); 
          //} else {
            const events = evts.map(event=>event.payload);
            //console.log(events);
            helpers.okObs(obs, events);
          //}
        }
      });
      return null;
    });
  }

}