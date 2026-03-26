const generateFullReport = async (userId, year, month) => {

  const user = await User.findById(userId);

  const monthlyAnalysis = await getMonthlyAnalysis(userId, year, month);
  const suspectedFoods = await getSuspectedFoods(userId);

  const crossReactions = [];
  for (const food of suspectedFoods) {
    const cr = await getCrossReactions(food.id);
    crossReactions.push(...cr);
  }

  await generateUserReport({
    user,
    monthlyAnalysis,
    suspectedFoods,
    crossReactions,
    year,
    month
  });
};