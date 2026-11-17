const router = require("express").Router();
const controller = require("../controllers/spaceController");
const autenticar = require("../middlewares/authMiddleware");
const permitirPerfis = require("../middlewares/roleMiddleware");

router.get("/", controller.listar);
router.get("/:id", controller.buscar);

// Somente ADMIN pode criar, editar ou excluir espaços.
router.post("/", autenticar, permitirPerfis("ADMIN"), controller.criar);
router.put("/:id", autenticar, permitirPerfis("ADMIN"), controller.atualizar);
router.delete("/:id", autenticar, permitirPerfis("ADMIN"), controller.excluir);

module.exports = router;
