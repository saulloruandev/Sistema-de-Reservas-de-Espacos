const router = require("express").Router();
const controller = require("../controllers/reservationController");
const autenticar = require("../middlewares/authMiddleware");
const permitirPerfis = require("../middlewares/roleMiddleware");

router.use(autenticar);

router.post("/", controller.criar);
router.get("/mine", controller.minhas);
router.get("/", permitirPerfis("ADMIN"), controller.todas);
router.get("/:id", controller.buscar);
router.put("/:id", controller.atualizar);
router.patch("/:id/cancel", controller.cancelar);
router.delete("/:id", controller.excluir);

module.exports = router;
