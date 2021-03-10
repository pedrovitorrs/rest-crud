async function test(req, res) {
    return res.status(200).json( {api: "okay"});
};

module.exports = {
    test,
};  