import {
  allowAll,
  auth,
  between,
  equal,
  newData,
  node,
  param,
  props,
  read,
  validate,
  write,
} from '@jahed/firebase-rules';

const taskNode = node(
  props({
    description: node(validate(newData.isString())),
    estimation: node(validate(newData.isNumber())),
    id: node(validate(newData.isString())),
    lastVoted: node(
      props({
        name: node(validate(newData.isString())),
        time: node(validate(newData.isString())),
      })
    ),
    name: node(validate(newData.isString())),
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
              completed: taskArrayNode,
              config: node(
                props({
                  hideLabel: node(
                    validate(
                      newData.isString((newVal) =>
                        // biome-ignore lint/performance/useTopLevelRegex: -
                        newVal.matches(/monkey|chicken|cow|fish|money/)
                      )
                    )
                  ),
                  isFreezeAfterVote: node(validate(newData.isBoolean())),
                })
              ),
              queue: taskArrayNode,
              room: node(
                props({
                  isPrivate: node(validate(newData.isBoolean())),
                  name: node(validate(newData.isString())),
                  password: node(validate(newData.isString())),
                })
              ),
              selectedTaskIndex: node(validate(newData.isNumber())),
              task: taskNode,
              users: node(
                param('$userID', ($userID) =>
                  node(
                    props({
                      isConnected: node(validate(newData.isBoolean())),
                      name: node(validate(newData.isString())),
                      point: node(
                        validate(
                          newData.isNumber((newVal) => between(newVal, -1, 101))
                        )
                      ),
                      role: node(validate(newData.isString())),
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
