import React from "react";
import _ from "lodash";
import { FormContainer, Select, DatePicker, Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { searchClient } from "@/services/client";
import AsyncSelect from "react-select/async";
import { searchUser } from "@/services/user";
import { useSelector } from "react-redux";
import { FORM_LAYOUT ,PAGE, DEFAULT_PAGE_SIZE} from "@/constants/app.constant";
import { useTranslation } from 'react-i18next';
import classNames from "classnames";

const Filters = (props) => {
  const { t } = useTranslation();
  const { getTableData, filterList } = props;
  // const { selectedCompany } = useSelector((state) => state.meta);

  const { control, reset, getValues, setValue } = useForm({
    defaultValues: {
      clientId: null,
      // companyId: null,
      name: null,
      startDate: null,
      endDate: null,
    },
  });

  const handleOnClear = () => {
    reset();
    getTableData(PAGE, DEFAULT_PAGE_SIZE);
  };

  // const onSearchClient = async (search, callback) => {
  //   if (search && search.length > 2) {
  //     const options = { search };
  //     // options.companyId = selectedCompany;
  //     const response = await searchClient(options);
  //     const data = _.map(response.data, (res) => ({
  //       value: res.id,
  //       label: res.name,
  //     }));
  //     callback(data);
  //   }
  // };

  // const onSearchUser = async (search, callback) => {
  //   if (search && search.length > 2) {
  //     const options = { search };
  //     // options.companyId = selectedCompany;
  //     const response = await searchUser(options);
  //     const data = _.map(response.data, (res) => ({
  //       value: res.id,
  //       label: res.username,
  //     }));
  //     callback(data);
  //   }
  // };

  const handleChange = (field, value) => {
    setValue(field, value);
    const options = _.cloneDeep(getValues());
    options[field] = value;
    options.clientId = options.clientId?.value;
    options.name = options.name?.value;
    // options.companyId = options.companyId?.value;
    getTableData(PAGE, DEFAULT_PAGE_SIZE, options);
  };

  return (
    <FormContainer
      className={classNames("grid gap-2 mt-2 items-center", ...FORM_LAYOUT)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => handleChange("name", value)}
            isClearable
            placeholder={t('label.Search By Name')}
            cacheOptions
            defaultOptions
            options={filterList}
            // componentAs={AsyncSelect}
          />
        )}
      />
      
      {/* <div className="grid grid-cols-2 gap-2">
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              placeholder={t('label.From')}
              isClearable
              {...field}
              onChange={(value) => handleChange("startDate", value)}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DatePicker
              placeholder={t('label.To')}
              isClearable
              {...field}
              onChange={(value) => handleChange("endDate", value)}
            />
          )}
        />
      </div> */}
      <div>
        <Button size="sm" type="button" onClick={handleOnClear}>
        {t('button.Clear All')}
        </Button>
      </div>
    </FormContainer>
  );
};

export default Filters;
