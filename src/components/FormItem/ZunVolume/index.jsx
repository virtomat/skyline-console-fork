// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { Select, Row, Col, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';
import InputInt from '../InputInt';

export default class ZunVolume extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      type: [],
      source: [],
      destination: '',
      cinderVolumeSize: 0,
      isCinderVolume: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { type, source, cinderVolumeSize, destination } =
      nextProps.value || {};
    if (
      type !== prevState.type ||
      source !== prevState.source ||
      cinderVolumeSize !== prevState.cinderVolumeSize ||
      destination !== prevState.destination
    ) {
      return {
        type,
        source,
        cinderVolumeSize,
        destination,
      };
    }
    return null;
  }

  onChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  onTypeChange = (value) => {
    if (value === 'cinder-new') {
      this.setState({
        isCinderVolume: true,
      });
    }
    if (value === 'cinder-available') {
      this.setState({
        isCinderVolume: false,
      });
    }
    this.onChange({
      ...this.state,
      type: value,
    });
  };

  onSourceChange = (value) => {
    this.onChange({
      ...this.state,
      source: value,
    });
  };

  onCinderVolumeSizeChange = (e) => {
    this.onChange({
      ...this.state,
      cinderVolumeSize: e,
    });
  };

  onDestinationChange = (e) => {
    this.onChange({
      ...this.state,
      destination: e.target.value,
    });
  };

  render() {
    const { type, source, destination, cinderVolumeSize, isCinderVolume } =
      this.state;
    const { name } = this.props;
    const selectType = (
      <Select
        value={type}
        options={this.props.optionsType}
        onChange={this.onTypeChange}
        className={styles.select}
        placeholder={t('Please select type')}
        required
      />
    );
    const selectSource = (
      <Select
        value={source}
        options={this.props.optionsSource}
        onChange={this.onSourceChange}
        className={styles.select}
        placeholder={t('Please select source')}
      />
    );
    const inputSize = (
      <InputInt
        value={cinderVolumeSize}
        onChange={this.onCinderVolumeSizeChange}
        style={{ maxWidth: '40%' }}
      />
    );
    const inputDestination = (
      <Input
        value={destination}
        onChange={this.onDestinationChange}
        style={{ maxWidth: '60%' }}
        required
      />
    );

    return (
      <Form.Item className={styles['zun-volume']} name={name}>
        <Row gutter={24}>
          <Col span={8}>
            <span className={styles.label}>{t('Type')}</span>
            {selectType}
          </Col>
          <Col span={8} hidden={isCinderVolume}>
            <span className={styles.label}>{t('Source')}</span>
            {selectSource}
          </Col>
          <Col span={8} hidden={!isCinderVolume}>
            <span className={styles.label}>{t('Size(GiB)')}</span>
            {inputSize}
          </Col>
          <Col span={8}>
            <span className={styles.label}>{t('Destination')}</span>
            {inputDestination}
          </Col>
        </Row>
      </Form.Item>
    );
  }
}
