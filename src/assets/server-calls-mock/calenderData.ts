let dateTime = new Date()

export let bookingData: Record<string, any>[] = [
  {
    Id: 1,
    Subject: 'Cut',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 9, 30),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 11, 30),
    IsAllDay: false,
    ClientId: 1,
    Description: "Testing Description"
  }, {
    Id: 2,
    Subject: 'Cut and Blow Dry',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 9, 30),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 10, 45),
    IsAllDay: false,
    ClientId: 2,
    Description: "Testing Description"
  }, {
    Id: 3,
    Subject: 'Colour',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 8),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 10, 30),
    IsAllDay: false,
    ClientId: 3,
    Description: "Testing Description"
  }, {
    Id: 4,
    Subject: 'Cut and Blow Dry',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 12),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 12, 30),
    IsAllDay: false,
    ClientId: 4
  }, {
    Id: 5,
    Subject: 'Colour',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 11),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 11, 50),
    IsAllDay: false,
    ClientId: 3,
    Description: "Testing Description"
  }, {
    Id: 6,
    Subject: 'Eye Brows',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 11, 30),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 13, 30),
    IsAllDay: false,
    ClientId: 2,
    Description: "Testing Description"
  }, {
    Id: 7,
    Subject: 'Colour and Cut',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 13, 40),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 14, 40),
    IsAllDay: false,
    ClientId: 3,
    Description: "Testing Description"
  }, {
    Id: 8,
    Subject: 'Cut',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 11, 30),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 13),
    IsAllDay: false,
    ClientId: 1,
    Description: "Testing Description"
  }, {
    Id: 9,
    Subject: 'Colour',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 14),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 15, 30),
    IsAllDay: false,
    ClientId: 6,
    Description: "Testing Description"
  }, {
    Id: 10,
    Subject: 'Cut',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 12),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 14),
    IsAllDay: false,
    ClientId: 7,
    Description: "Testing Description"
  }, {
    Id: 11,
    Subject: 'Colour and Cut',
    StartTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 13, 30),
    EndTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 14, 45),
    IsAllDay: false,
    ClientId: 5,
    Description: "Testing Description"
  }
];