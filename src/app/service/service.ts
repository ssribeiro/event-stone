import { Command } from '../models/command';
import { EventStore } from './event-store';

export const NAME = 'Event Store';

export const CHANNEL = {
	IN:'get_events',
	OUT:'got_events',
};

export const COMMAND = {
	POST:"[Put]",
	GET_ALL:"[Get All]",
	GET_SINCE:"[Get Since]",
	GET_SINCE_TILL:"[Get Since Till]"
};

export const Service = EventStore;

export const operate = (cmd:Command, sv) => {
  switch (cmd.type) {

    case COMMAND.POST:
      return sv.post(cmd.payload);

    case COMMAND.GET_ALL:
      return sv.getFromTo();
    
    case COMMAND.GET_SINCE:
      return sv.getFromTo(cmd.payload);
    
    case COMMAND.GET_SINCE_TILL:
      return sv.getFromTo(cmd.payload.since, cmd.payload.till);      
    
    default:
      return null;
  }
};