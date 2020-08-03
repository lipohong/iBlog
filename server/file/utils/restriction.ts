const formExpressionFromRestriction = (expression: object, restriction: object) => {
  if (restriction) {
    for (let i in restriction) {
      if (i === '$and' || i === '$or') {
        if (expression[i]) {
          restriction[i].map(r => {
            expression[i].push(r);
          });
        } else {
          expression[i] = restriction[i];
        }
      } else if (!expression[i]) {
        expression[i] = restriction[i];
      }
    }
  }

  if (expression['$and'] && expression['$and'].length <= 0) {
    delete expression['$and'];
  }

  return expression;
}

export { formExpressionFromRestriction }
