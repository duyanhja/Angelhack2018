const allOptions = [
      {name:"Bus Tracker"},
      {name:"Weather"},
      {name:"None"}];

function ClockFace(props) {
  return (
    <Page>
      <Section
        title={<Text>Clock Face Background Color</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: 'black'},
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'}
          ]}
        />
      </Section>

      <Section
        title={<Text>Button Settings</Text>}>
        <Select
          label={"Top-Left"}
          settingsKey="topLeft"
          options={allOptions}
         />
        <Select
          label={"Top-Right"}
          settingsKey="topRight"
          options={allOptions}
         />
        <Select
          label={"Bottom-Left"}
          settingsKey="bottomLeft"
          options={allOptions}
         />
        <Select
          label={"Bottom-Right"}
          settingsKey="bottomRight"
          options={allOptions}
         />
      </Section>
    </Page>
  );
}

registerSettingsPage(ClockFace);