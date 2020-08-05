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
  InteractionDirectionTypes,
  ChannelTypes,
  InteractionStates,
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
      direction: InteractionDirectionTypes.Inbound,
      state: InteractionStates.Alerting,
      channelType: ChannelTypes.Telephony,
      details: interactionDetails
    };

    setInteraction(this.interaction);
  }

  answerCall() {
    this.interaction.state = InteractionStates.Connected;
    setInteraction(this.interaction);
  }

  endCall() {
    this.interaction.state = InteractionStates.Disconnected;
    setInteraction(this.interaction);
    this.removeCall();
  }

  removeCall() {
    this.callEnd.emit();
  }
  holdCall() {
    this.interaction.state = InteractionStates.OnHold;
    setInteraction(this.interaction);
  }
  unholdCall() {
    this.interaction.state = InteractionStates.Connected;
    setInteraction(this.interaction);
  }
  getInteractionStateAsString(state: InteractionStates) {
    return InteractionStates[state];
  }
}
