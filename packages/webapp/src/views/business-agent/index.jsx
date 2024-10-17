import React, { useEffect, useState } from "react";
import _ from "lodash";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { Container, AuthorityCheck } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { toast, Button } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import BusinessAgentList from "./list";
import { useTranslation } from "react-i18next";
import { getRoles } from "@/services/role";
import { getRegion } from "@/services/region";
import { getUsers } from "@/services/user";

const BusinessAgent = () => {
  const params = useParams();
  const { t } = useTranslation();
  const [userList, setUserList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [roles, setRoles] = useState([]);
  const [RegionList, setRegionList] = useState([]);
  const [businessAgent, setBusinessAgent] = useState({});
  useEffect(() => {
    getBusinessAgents(page, limit);
    getRolesData();
    getRegionData(page, limit);
  }, []);
  const getBusinessAgents = async (page, limit, options = {}) => {
    setLoading(true);
    options.page = page;
    options.limit = limit;
    options = _.pickBy(options, _.identity);
    try {
      const response = await getUsers(options);
      const filteredRows = response.data.rows.filter(
        (row) => row.role === "Business Manager"
      );
      setUserList(filteredRows);
      const data = _.map(response?.data?.rows, (row) => ({
        value: row.id,
        label: row.name,
      }));
      setFilterList(data);
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

  const getRolesData = async (options = {}) => {
    setLoading(true);
    try {
      const response = await getRoles(options);
      const data = _.map(response.data, (row) => ({
        value: row.id,
        label: row.name,
      }));
      setRoles(data);
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

  const onDialogClose = () => {
    getBusinessAgents();
    setTimeout(() => {
      setIsEdit(false);
    }, 700);
    setVisible(false);
  };

  const handleEditBusinessAgents = (businessAgent) => {
    setIsEdit(true);
    setVisible(true);
    setBusinessAgent(businessAgent);
  };

  return (
    <Container>
      <UserForm
        open={visible}
        onClose={onDialogClose}
        isEdit={isEdit}
        data={businessAgent}
        roles={roles}
        RegionList={RegionList}
      />
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <h3>{t("heading.Business Agent")}</h3>
          <div className="flex items-center gap-2">
            <AuthorityCheck authority={["can_add_business_agents"]}>
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
        <Filters getTableData={getBusinessAgents} filterList={filterList} />
      </div>
      <Container className="p-4">
        <BusinessAgentList
          data={userList}
          count={count}
          page={page}
          limit={limit}
          getTableData={getBusinessAgents}
          loading={loading}
          handleEditClick={handleEditBusinessAgents}
        />
      </Container>
    </Container>
  );
};

export default BusinessAgent;
