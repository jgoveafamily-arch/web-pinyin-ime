import { PureComponent } from 'react';
import AutoComplete from 'antd/es/auto-complete';
import TextArea from 'antd/es/input/TextArea';
import { throttle } from 'lodash';

import getCandidates from './ime_engine';
import styles from './IME.module.css';

const Max_Candidates = 50;

interface IOption {
  label: string;
  value: string;
}

interface iProps {}
interface IState {
  options: IOption[];
  value: string;
  rawInput: string;
  currentInput: string;
}

export default class IME extends PureComponent<iProps, IState> {
  getCandidatesThrottled: any;
  constructor(props: iProps) {
    super(props);

    this.state = {
      options: [],
      value: '',
      rawInput: '',
      currentInput: '',
    };

    this.getCandidatesThrottled = throttle(this.getCandidates, 100);
  }

  getCandidates = (rawInput: string) => {
    const arr = rawInput
      .trim()
      .toLowerCase()
      .replace(/[^\x00-\x7F]/g, '') // remove chinese characters.
      .replace(/[^\w\s]|_/g, ' ') // replace punctuation such as `,.?'"` with space.
      .split(' ');

    const input = arr[arr.length - 1]; // only use the last pinyin characters as actual input to get candidates.

    this.setState({
      rawInput,
      currentInput: input,
    });

    if (input) {
      this.setState({
        options: getCandidates(input)
          .slice(0, Max_Candidates)
          .map((word: string) => ({
            label: word,
            value: word,
          })),
      });
    } else {
      this.setState({
        options: [],
      });
    }
  };

  onSelect = (value: string, _option: object): any => {
    this.setState({
      // we must keep the raw input, includes existing Chinese characters and all punctuations and space.
      value: this.state.rawInput.replace(this.state.currentInput, value),
    });
  };

  onChange = (value: string) => {
    this.setState({ value });
  };

  handleSave = () => {
    const { value } = this.state;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chinese_notes_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
render() {
    const { value, options } = this.state;
    return (
      <div className={styles.inputBox}>
        {/* Added a toolbar for the editor controls */}
        <div className={styles.toolbar}>
          <h2>Chinese Pinyin Editor</h2>
          <button className={styles.saveBtn} onClick={this.handleSave}>
            保存文件 (Save to File)
          </button>
        </div>

        <AutoComplete
          value={value}
          options={options}
          className={styles.autoCompleteWrapper}
          onSelect={this.onSelect}
          onSearch={this.getCandidatesThrottled}
          onChange={this.onChange}
        >
          <TextArea
            placeholder='Please input Chinese pinyin 请输入拼音'
            className={styles.editorTextArea}
            // Auto-size lets the editor grow, or set minRows/maxRows
            autoSize={{ minRows: 15, maxRows: 30 }} 
          />
        </AutoComplete>
      </div>
    );
  }
}
