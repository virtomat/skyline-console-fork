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
import { inject, observer } from 'mobx-react';
import { Button, Divider, Badge } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { ProjectStore } from 'stores/keystone/project';
import Base from 'containers/TabDetail';
import UserGroup from '../../UserGroup';
import User from '../../User';
import Quota from './Quota';
import styles from './index.less';
import actionConfigs from '../actions';

@inject('rootStore')
@observer
export default class InstanceDetail extends Base {
  get name() {
    return t('project');
  }

  get policy() {
    return 'os_compute_api:os-quota-sets:defaults';
  }

  get listUrl() {
    return this.getUrl('/identity/project');
  }

  get actionConfigs() {
    return actionConfigs;
  }

  init() {
    this.store = new ProjectStore();
  }

  get forceLoadingTabs() {
    return ['quota'];
  }

  get detailInfos() {
    return [
      {
        title: t('Project Name'),
        dataIndex: 'name',
      },
      {
        title: t('Enabled'),
        dataIndex: 'enabled',
        isHideable: true,
        render: (val) => {
          if (val === true) {
            return <Badge color="green" text={t('Yes')} />;
          }
          return <Badge color="red" text={t('No')} />;
        },
      },
      {
        title: t('User Num'),
        dataIndex: 'user_num',
      },
      {
        title: t('User Group Num'),
        dataIndex: 'group_num',
      },
      {
        title: t('Tags'),
        dataIndex: 'tags',
        render: (tags) => tags.join(','),
      },
      {
        title: t('Description'),
        dataIndex: 'description',
      },
    ];
  }

  get tabs() {
    const tabs = [
      {
        title: t('Project User'),
        key: 'user',
        component: User,
      },
      {
        title: t('Project User  Group'),
        key: 'userGroup',
        component: UserGroup,
      },
      {
        title: t('Project Quota'),
        key: 'quota',
        component: Quota,
      },
    ];
    return tabs;
  }

  goEdit = () => {
    const {
      params: { id },
    } = this.props.match;
    this.routing.push(`${this.listUrl}/edit/${id}`);
  };

  get detailTitle() {
    const {
      detail: { id },
    } = this.store;
    const { collapsed } = this.state;
    const icon = collapsed ? <DownOutlined /> : <UpOutlined />;
    return (
      <div>
        <span className={styles['title-label']}>{t('Project ID')}:</span>
        <span className={styles['header-title']}>{id}</span>
        <Divider type="vertical" className={styles['header-divider']} />
        <Button onClick={this.goBack} type="link">
          {t('Back')}
        </Button>
        <Button
          onClick={this.handleDetailInfo}
          icon={icon}
          type="link"
          className={styles['header-button']}
        />
      </div>
    );
  }
}
