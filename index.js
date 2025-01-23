const { Command } = require("commander");
const fs = require("fs");
const { deserialize } = require("v8");
const FILE = "./expense.json";
const da = new Date();

let program = new Command();

const readfile = async () => {
  data = fs.readFileSync(FILE, "utf-8");
  data = JSON.parse(data);
  return data;
};
const writefile = async (data) => {
  data = JSON.stringify(data);
  fs.writeFileSync(FILE, data);
};

const summaryexpense = async (options) => {
  data = await readfile();
  let total = 0;
  if (options.month) {
    current_month = options.month;

    for (let i = 0; i < data.length; i++) {
      if (Number(data[i].Date.split("-")[1]) == current_month) {
        total += data[i].Amount;
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      total += data[i].Amount;
    }
  }
  console.log(`Total expense of that is ${total}`);
};

const addingtask = async (options) => {
  var new_expense = {
    Date: da.toISOString().split("T")[0],
    Description: options.description,
    Amount: Number(options.amount),
  };

  data = await readfile();
  data.push(new_expense);
  writefile(data);
};

const listexpenses = async () => {
  data = await readfile();
  console.log(`#      Date        Description         Amount`);
  for (let i = 0; i < data.length; i++) {
    date = data[i].Date.padEnd(12, " ");
    description = data[i].Description.padEnd(20, " ");
    amount = `${data[i].Amount}`.padEnd(6, " ");
    console.log(`# ${date} ${description} ${amount}`);
  }
};

const deleteexpense = async (options) => {
  data = await readfile();
  id = options.id;
  data.splice(id, 1);
  writefile(data);
};
program
  .command("add")
  .description("Adding a expense")
  .requiredOption("--description <des_string>", "expense description")
  .requiredOption("--amount <cost>", "Expense amount")
  .action(addingtask);

program
  .command("summary")
  .description("summary all the expenses of the current month")
  .option("--month <month>", "Specifying the month for expense")
  .action(summaryexpense);

program
  .command("list")
  .description("lists all the expenses of the current month")
  .action(listexpenses);

program
  .command("delete")
  .description("delete an expense")
  .requiredOption("--id <id>", "ID of the value to be deleted")
  .action(deleteexpense);

program.parse(process.argv);
