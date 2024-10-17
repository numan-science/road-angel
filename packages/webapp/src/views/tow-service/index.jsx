import React, { useEffect, useState } from "react";
import _ from "lodash";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { getTowService } from "@/services/tow-service";
import { Container, AuthorityCheck } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { toast, Button } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import CompanyUserList from "./list";
import { useTranslation } from "react-i18next";
import { getRegion } from "@/services/region";

const TowService = () => {
  const params = useParams();
  const { t } = useTranslation();
  const [towServiceList, setTowServiceList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [towServiceUser, setTowServiceUser] = useState({});
  const [RegionList, setRegionList] = useState([]);

  useEffect(() => {
    getTowServiceData(page, limit);
    getRegionData();
  }, []);
  const getTowServiceData = async (page, limit, options = {}) => {
    setLoading(true);
    options.page = page;
    options.limit = limit;
    options = _.pickBy(options, _.identity);
    try {
      const response = await getTowService(options);
      setTowServiceList(response.data.rows);
      setCount(response.data.count);
      const data = _.map(response?.data?.rows, (row) => ({
        value: row.name,
        label: row.name,
      }));
      setFilterList(data);
      setLimit(limit);
      setPage(page);
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>
      );
    }
    setLoading(false);
  };

  const getRegionData = async (page, limit, options = {}) => {
    setLoading(true);
    options.page = page;
    options.limit = limit;
    options = _.pickBy(options, _.identity);
    try {
      const response = await getRegion(options);
      const data = _.map(response.data.rows, (row) => ({
        value: row.id,
        label: row.name,
      }));
      setRegionList(data);
      setCount(response.data.count);
      setLimit(limit);
      setPage(page);
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>
      );
    }
    setLoading(false);
  };

  const addNewPost = () => {
    setVisible(true);
  };

  const onDialogClose = () => {
    getTowServiceData();
    setTimeout(() => {
      setIsEdit(false);
    }, 700);
    setVisible(false);
  };

  const handleEditCompanyUser = (towServiceUser) => {
    setIsEdit(true);
    setVisible(true);
    setTowServiceUser(towServiceUser);
  };

  return (
    <Container>
      <UserForm
        open={visible}
        onClose={onDialogClose}
        isEdit={isEdit}
        data={towServiceUser}
        RegionList={RegionList}
      />
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <h3>{t("heading.Tow Service")}</h3>
          <div className="flex items-center gap-2">
            <AuthorityCheck authority={["can_add_tow_service"]}>
              <Button
                size="sm"
                icon={<HiOutlinePlusCircle />}
                onClick={addNewPost}
              >
                {t("button.Add New")}
              </Button>
            </AuthorityCheck>
          </div>
        </div>
        <Filters getTableData={getTowServiceData} filterList={filterList} />
      </div>
      <Container className="p-4">
        <CompanyUserList
          data={towServiceList}
          count={count}
          page={page}
          limit={limit}
          getTableData={getTowServiceData}
          loading={loading}
          handleEditClick={handleEditCompanyUser}
        />
      </Container>
    </Container>
  );
};

export default TowService;
