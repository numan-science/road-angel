import React from "react";
import _ from "lodash";
import { FormContainer, Select, Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { FORM_LAYOUT, PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

const Filters = (props) => {
  const { t } = useTranslation();
  const { getTableData, filterList } = props;
  const { control, reset, getValues, setValue } = useForm({
    defaultValues: {
      clientId: null,
      userId: null,
      startDate: null,
      endDate: null,
      name: null,
    },
  });

  const handleOnClear = () => {
    reset();
    getTableData(PAGE, DEFAULT_PAGE_SIZE);
    // data();
  };

  // const onSearchClient = async (search, callback) => {
  //   if (search && search.length > 2) {
  //     const options = { search };
  //     const response = await searchClient(options);
  //     const data = _.map(response.data, (res) => ({
  //       value: res.id,
  //       label: res.name,
  //     }));
  //     callback(data);
  //   }
  // };

  const handleChange = (field, value) => {
    setValue(field, value);
    const options = _.cloneDeep(getValues());
    options[field] = value;
    options.clientId = options.clientId?.value;
    options.clientId = options.clientId?.value;
    options.name = options.name?.value;
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
            placeholder={t("label.Search By Name")}
            // defaultOptions
            options={filterList}
            // componentAs={AsyncSelect}
          />
        )}
      />
      {/* <Controller
        control={control} 
        name="clientId"
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => handleChange("clientId", value)}
            isClearable
            placeholder={t('label.Search By Role')}
            cacheOptions
            defaultOptions
            loadOptions={onSearchClient}
            componentAs={AsyncSelect}
          />
        )}
      /> */}

      <div>
        <Button size="sm" type="button" onClick={handleOnClear}>
          {t("button.Clear All")}
        </Button>
      </div>
    </FormContainer>
  );
};

export default Filters;
