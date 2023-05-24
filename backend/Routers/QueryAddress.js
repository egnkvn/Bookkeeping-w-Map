import { User } from "../Models/Record.js";

const QueryAddress = async (req, res) => {
  const { username, date_YM, status } = req.query;
  const user = await User.findOne({ username }).populate("records");
  var NewRecords = await user.records.filter((item) => {
    return (
      item.date_YM === date_YM && item.address !== "" && item.status === status
    );
  });
  res.send({ NewRecords });
};
export default QueryAddress;
