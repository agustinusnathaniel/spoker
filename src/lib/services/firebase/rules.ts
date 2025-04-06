import {
  allowAll,
  auth,
  between,
  equal,
  newData,
  node,
  param,
  props,
  validate,
  read,
  write,
} from '@jahed/firebase-rules';

const taskNode = node(
  props({
    id: node(validate(newData.isString())),
    name: node(validate(newData.isString())),
    description: node(validate(newData.isString())),
    lastVoted: node(
      props({
        name: node(validate(newData.isString())),
        time: node(validate(newData.isString())),
      })
    ),
    estimation: node(validate(newData.isNumber())),
    pointEntries: node(
      param('$index', () =>
        node(
          props({
            name: node(validate(newData.isString())),
            point: node(validate(newData.isNumber())),
          })
        )
      )
    ),
  }),
  write(allowAll)
);

const taskArrayNode = node(
  param('$index', () => taskNode),
  write(allowAll)
);

export const rules = {
  rules: node(
    props({
      rooms: node(
        param('$roomID', () =>
          node(
            props({
              config: node(
                props({
                  hideLabel: node(
                    validate(
                      newData.isString((newVal) =>
                        newVal.matches(/monkey|chicken|cow|fish|money/)
                      )
                    )
                  ),
                  isFreezeAfterVote: node(validate(newData.isBoolean())),
                })
              ),
              room: node(
                props({
                  isPrivate: node(validate(newData.isBoolean())),
                  name: node(validate(newData.isString())),
                  password: node(validate(newData.isString())),
                })
              ),
              task: taskNode,
              queue: taskArrayNode,
              completed: taskArrayNode,
              selectedTaskIndex: node(validate(newData.isNumber())),
              users: node(
                param('$userID', ($userID) =>
                  node(
                    props({
                      name: node(validate(newData.isString())),
                      role: node(validate(newData.isString())),
                      point: node(
                        validate(
                          newData.isNumber((newVal) => between(newVal, -1, 101))
                        )
                      ),
                      isConnected: node(validate(newData.isBoolean())),
                    }),
                    write(equal($userID, auth.uid)),
                    validate(newData.hasChildren(['name', 'role']))
                  )
                )
              ),
            }),
            write(allowAll)
          )
        ),
        read(allowAll)
      ),
    })
  ),
};
