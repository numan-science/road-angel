import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import _ from "lodash";
import classNames from "classnames";
import AsyncSelect from "react-select/async";
import { searchRole } from "@/services/role";
import { FormContainer, Select } from "@/components/ui";
import { FORM_LAYOUT } from "@/constants/app.constant";
import { useTranslation } from 'react-i18next';

const Filters = (props) => {
	const { t } = useTranslation();
	const { getTableData } = props;

	const { control, setValue } = useForm({
		defaultValues: {
			roleId: null,
		},
	});

	// const { selectedCompany } = useSelector((state) => state.meta);

	const onSearchRole = async (search, callback) => {
		if (search && search.length > 2) {
			const options = { search };
			// options.companyId = selectedCompany;
			const response = await searchRole(options);
			const data = _.map(response.data, (res) => ({
				value: res.id,
				label: res.name,
			}));
			callback(data);
		}
	};

	const handleChange = (roleId) => {
		setValue("roleId", roleId);
		const options = {};
		options.roleId = roleId?.value;
		getTableData(undefined, undefined, options);
	};

	return (
		<FormContainer
			className={classNames("grid gap-2 mt-2 items-center", ...FORM_LAYOUT)}
		>
			<Controller
				control={control}
				name="roleId"
				render={({ field }) => (
					<Select
						{...field}
						isClearable
						cacheOptions
						defaultOptions
						placeholder={t('label.Search Role')}
						onChange={handleChange}
						componentAs={AsyncSelect}
						loadOptions={onSearchRole}
					/>
				)}
			/>
		</FormContainer>
	);
};

export default Filters;
