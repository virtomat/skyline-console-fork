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

import { inject, observer } from 'mobx-react';
import { ModalAction } from 'containers/Action';
import globalProjectStore from 'stores/keystone/project';
import { regex } from 'utils/validate';
import { statusTypes } from 'utils/constants';

@inject('rootStore')
@observer
class EditForm extends ModalAction {
  init() {
    this.store = globalProjectStore;
  }

  static id = 'project-edit';

  static title = t('Edit');

  static policy = 'identity:update_project';

  static allowed() {
    return Promise.resolve(true);
  }

  get name() {
    const { name } = this.item;
    return `${t('Edit')} ${name}`;
  }

  get defaultValue() {
    const { name, description, enabled } = this.item;
    if (name && this.formRef.current) {
      this.formRef.current.setFieldsValue({
        name,
        description,
        enabled: statusTypes.filter((it) => it.value === enabled),
      });
    }
    return {};
  }

  checkName = (rule, value) => {
    if (!value) {
      return Promise.reject(t('Please input'));
    }
    const { nameRegexWithoutChinese } = regex;
    if (!nameRegexWithoutChinese.test(value)) {
      return Promise.reject(t('Invalid: Project name can not be chinese'));
    }
    const {
      list: { data },
    } = this.store;
    const { name } = this.item;
    const nameUsed = data.filter((it) => it.name === value);
    if (nameUsed[0] && nameUsed[0].name !== name) {
      return Promise.reject(t('Invalid: Project name can not be duplicated'));
    }
    return Promise.resolve();
  };

  get formItems() {
    return [
      {
        name: 'name',
        label: t('Name'),
        type: 'input',
        value: this.item.name,
        validator: this.checkName,
        extra: t('Project') + t('Name can not be duplicated'),
      },
      {
        name: 'enabled',
        label: t('Status'),
        type: 'radio',
        optionType: 'default',
        isWrappedValue: true,
        options: statusTypes,
        disabled: true,
        help: t(
          'Disabling the project will have a negative impact. If the users associated with the project are only assigned to the project, they will not be able to log in'
        ),
      },
      {
        name: 'description',
        label: t('Description'),
        type: 'textarea',
      },
    ];
  }

  onSubmit = (values) => {
    const { description, name } = values;
    const { id } = this.item;
    return globalProjectStore.edit({ id, description, name });
  };
}

export default EditForm;
