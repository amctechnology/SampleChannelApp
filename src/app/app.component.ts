import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { initializeComplete, InteractionStates, setAppHeight, SearchRecords, registerClickToDial, setPresence, onPresenceChanged, registerOnPresenceChanged, registerEnableClickToDial, enableClickToDial } from '@amc-technology/davinci-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'SampleChannelApp';

  config;

  calls: {
    id: string,
    number: string,
    state?: InteractionStates
  } [] = [];
  phoneNumbers = [
    '555-123-4567',
    '555-867-5309',
    '555-000-0001',
    '555-999-9999',
  ];
  nextPhoneNumberIndex = 0;
  constructor() {
    this.callSpecific = this.callSpecific.bind(this);
  }

  async ngOnInit() {
    await initializeComplete().then(configReturn => {
      this.config = configReturn;
    });
    registerClickToDial(this.callSpecific);
    enableClickToDial(true);
    setPresence('Not Ready');
    registerOnPresenceChanged(async (presence, reason, appname) => {
      if (appname !== this.config.name) {
        setPresence(presence, reason);
      }
    });
  }

  ngAfterViewChecked() {
    setAppHeight(document.body.clientHeight);
  }

  newCall() {
    this.calls = [... this.calls, {
      id: `Call-${Math.random()}`,
      number: this.getNextPhoneNumber()
    }];
  }

  private getNextPhoneNumber() {
    const result = this.phoneNumbers[this.nextPhoneNumberIndex];
    this.nextPhoneNumberIndex = (this.nextPhoneNumberIndex + 1) % this.phoneNumbers.length;
    return result;
  }

  removeCall(id: string) {
    this.calls = this.calls.filter(call => call.id !== id);
  }

  async callSpecific(phone: string) {
    this.calls = [... this.calls, {
      id: `Call-${Math.random()}`,
      number: phone,
      state: InteractionStates.Connected
    }];
  }
}
