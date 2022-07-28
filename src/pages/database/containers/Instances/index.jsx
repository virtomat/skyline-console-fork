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
import { observer, inject } from 'mobx-react';
import Base from 'containers/List';
import globalInstancesStore from 'stores/trove/instances';
import { InstanceStatus } from 'resources/trove/database';
import actions from './actions';

export class Instances extends Base {
  init() {
    this.store = globalInstancesStore;
  }

  get name() {
    return t('database instances');
  }

  get actionConfigs() {
    if (this.isAdminPage) {
      return actions.actionConfigsAdmin;
    }
    return actions.actionConfigs;
  }

  get policy() {
    return 'instance:index';
  }

  get aliasPolicy() {
    return 'trove:instance:index';
  }

  get searchFilters() {
    return [
      {
        label: t('Name'),
        name: 'name',
      },
    ];
  }

  getColumns = () => [
    {
      title: t('ID/Name'),
      dataIndex: 'name',
      routeName: this.getRouteName('databaseInstanceDetail'),
    },
    {
      title: t('Project ID/Name'),
      dataIndex: 'project_name',
      isHideable: true,
      hidden: !this.isAdminPage,
    },
    {
      title: t('Datastore'),
      dataIndex: 'type',
    },
    {
      title: t('Datastore Version'),
      dataIndex: 'version',
      isHideable: true,
    },
    {
      title: t('Host'),
      dataIndex: 'ip',
      render: (value) => {
        return value && value.length ? (
          <>
            {value.map((it) => (
              <div key={it}>{it}</div>
            ))}
          </>
        ) : (
          '-'
        );
      },
      isHideable: true,
    },
    {
      title: t('Volume Size'),
      dataIndex: 'size',
      isHideable: true,
      render: (value) => (value ? `${value}GiB` : '-'),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (value) => InstanceStatus[value] || value,
    },
  ];
}

export default inject('rootStore')(observer(Instances));
