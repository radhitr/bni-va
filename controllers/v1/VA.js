const request = require('request-promise');
const config = require('./../../config');
const codeMapper = require('../../configs/code-mapper');
const { httpStatus, errorCodes } = require('./../../configs/codes');
const BniEncryption = require('../../utils/BniEncryption');
const vaController = {
  /**
   * @swagger
   * /v1/va/create:
   *   post:
   *     summary: Create VA
   *     tags:
   *      - VA
   *     produces:
   *        application/json
   *     parameters:
   *        - in: body
   *          name: body
   *          description: Parameters that needs to be added to the api
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              type:
   *                type: string
   *              client_id:
   *                type: string
   *              trx_id:
   *                type: string
   *              trx_amount:
   *                type: integer
   *              billing_type:
   *                type: string
   *              customer_name:
   *                type: string
   *              customer_phone:
   *                type: string
   *        - in: body
   *          name: body
   *          description: Additional parameter for api
   *          required: false
   *          schema:
   *            type: object
   *            properties:
   *              customer_email:
   *                type: string
   *              virtual_account:
   *                type: string
   *              datetime_expired:
   *                type: string
   *
   *     responses:
   *       200:
   *         description: success
   *       500:
   *         description: internal server error
   */

  create: async (req, res) => {
      try {

        console.log('Client ID');
        console.log(config.get('BNI_CID'));
        console.log(config.get('BNI_SCK'));

        req.body.client_id = config.get('BNI_CID');
        req.body.type = config.get('BNI_VA_TYPE');
        const dateExpired = new Date(+new Date() + 24 * 3600 * 1000);
        const data = {
          "client_id" : "394",
          "trx_amount" : "500000",
          "customer_name" : "Faris Rayhan",
          "customer_email" : "rayhan_faris1234@email.com",
          "customer_phone" : "628123923193",
          "description": "Create test billing",
          "trx_id" : "1930000111",
          "datetime_expired" : dateExpired.toISOString(),
          "billing_type" : "d",
          "type" : " createdebitcardless",
          "virtual_account": "8394082122624566"
        };

        const bodyEncrypted = BniEncryption.encrypt(data,"394",'1dd73b81e3efea961ea684f0bb66febe');
        const requestObject = {
          method: 'POST',
          uri: `${config.get('BNI_DEVELOPMENT_URL')}`,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            client_id: config.get('BNI_CID'),
            data: bodyEncrypted
          },
          resolveWithFullResponse: true,
          json: true
        };

        /*console.log(requestObject);
        console.log('req body');
        console.log(req.body);*/

        //const result = await request(requestObject);

        /*if (!result.body.success) {
          return res.status(result.statusCode).json({
            status: result.statusCode,
            success: false,
            message: result.body.message,
            code: codeMapper.BoostBNIVA[result.body.code]
          });
        }*/
        return res.json({bodyEncrypted})
        //return res.status(result.statusCode).json(result.body);

      } catch (e) {
        let errorStatus = httpStatus.internalServerError;
        let errorMessage = e.message;
        let errorCode = errorCodes.internalServerError;

        if (e.statusCode) {
          errorStatus = e.statusCode;
          errorMessage = e.error.message;
          errorCode = codeMapper.BoostBNIVA[e.error.code];
        }

        return res.status(errorStatus).json({
          status: errorStatus,
          success: false,
          message: errorMessage,
          code: errorCode
        });
      }
  },
  withdraw: async (req, res) => {

  }
};

module.exports = (router) => {
  router.post('/create', vaController.create);
  router.post('/withdraw', vaController.withdraw)
};
