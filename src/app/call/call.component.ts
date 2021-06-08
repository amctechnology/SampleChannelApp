import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  setInteraction,
  IInteraction,
  INTERACTION_DIRECTION_TYPES,
  CHANNEL_TYPES,
  INTERACTION_STATES,
  RecordItem,
  registerClickToDial,
  registerScreenpop,
  SearchRecords
} from '@amc-technology/davinci-api';
// TODO: INTERN Please try to study and review this file. This component is whats actually taking our fake simulated call
// and alerting the CRM app of its existence. To let the CRM app know that a call has come in, or that the state has changed, etc
// It will update the call object and then call our davinci api's method "setInteraction". setInteraction will get caught in the CRM
// app in the method "onInteraction"
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit {
  @Input() id: string;
  @Input() number: string;
  @Output() callEnd = new EventEmitter();
  interaction: IInteraction;

  constructor() {
  }

  ngOnInit() {
    const interactionDetails = new RecordItem('', '', '');
    interactionDetails.setPhone('phoneNumber', 'phoneNumber', this.number);
    this.interaction = {
      interactionId: this.id,
      scenarioId: this.id,
      direction: INTERACTION_DIRECTION_TYPES.Inbound,
      state: INTERACTION_STATES.Alerting,
      channelType: CHANNEL_TYPES.Telephony,
      details: interactionDetails
    };

    setInteraction(this.interaction);
  }

  answerCall() {
    this.interaction.state = INTERACTION_STATES.Connected;
    setInteraction(this.interaction);
  }

  endCall() {
    this.interaction.state = INTERACTION_STATES.Disconnected;
    setInteraction(this.interaction);
    this.removeCall();
  }

  removeCall() {
    this.callEnd.emit();
  }
  holdCall() {
    this.interaction.state = INTERACTION_STATES.OnHold;
    setInteraction(this.interaction);
  }
  unholdCall() {
    this.interaction.state = INTERACTION_STATES.Connected;
    setInteraction(this.interaction);
  }
  getInteractionStateAsString(state: INTERACTION_STATES) {
    return INTERACTION_STATES[state];
  }
}
