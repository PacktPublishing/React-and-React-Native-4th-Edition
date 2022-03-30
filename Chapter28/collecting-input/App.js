import React, { useState } from "react";
import {
  Input,
  Stack,
  FormControl,
  Select,
  Checkbox,
  Radio,
} from "native-base";
import Container from "./Container";

export default function App() {
  const [text, setText] = useState("");
  const [select, setSelect] = useState();
  const [checkbox, setCheckbox] = useState(true);
  const [radio, setRadio] = useState();

  const options = ["First", "Second", "Third"];

  return (
    <Container title="Collecting Input">
      <FormControl>
        <Stack space={5} px={2}>
          <Stack>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              p={2}
              placeholder="Username"
              value={text}
              onChange={setText}
            />
          </Stack>

          <Stack>
            <FormControl.Label>Select</FormControl.Label>
            <Select
              placeholder="Select"
              selectedValue={select}
              onValueChange={(itemValue) => setSelect(itemValue)}
            >
              {options.map((item) => (
                <Select.Item key={item} label={item} value={item} />
              ))}
            </Select>
          </Stack>

          <Stack>
            <FormControl.Label>Select</FormControl.Label>
            <Checkbox
              isChecked={checkbox}
              onChange={setCheckbox}
              colorScheme="green"
            >
              Checkbox
            </Checkbox>
          </Stack>

          <Stack>
            <Radio.Group
              name="Radio"
              value={radio}
              onChange={(nextValue) => {
                setRadio(nextValue);
              }}
            >
              <Radio value="one" my={1}>
                One
              </Radio>
              <Radio value="two" my={1}>
                Two
              </Radio>
            </Radio.Group>
          </Stack>
        </Stack>
      </FormControl>
    </Container>
  );
}
