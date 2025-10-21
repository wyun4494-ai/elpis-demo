module.exports = {
  '/api/proj/user/list': {
    query: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
        nickname: {
          type: 'string',
        },
        sex: {
          type: 'number',
        },
        create_time_start: {
          type: 'string',
        },
        create_time_end: {
          type: 'string',
        },
        page: {
          type: 'number',
        },
        pageSize: {
          type: 'number',
        },
      },
      required: ['page', 'pageSize'],
    }
  },
  'api/proj/user': {
    get: {
      query: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
          },
        },
        required: ['user_id'],
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
          },
          nickname: {
            type: 'string'
          },
          sex: {
            type: 'number'
          },
          desc: {
            type: 'string'
          }
        },
      }
    },
    put: {
      body: {
        properties: {
          nickname: {
            type: 'string'
          },
          sex: {
            type: 'number'
          },
          desc: {
            type: 'string'
          }
        },
        required: ['nickname', 'sex', 'desc']
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
          },
        },
        required: ['user_id'],
      }
    }
  }
}