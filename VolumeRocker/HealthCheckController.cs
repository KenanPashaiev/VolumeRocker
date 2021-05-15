using System.Web.Http;

namespace VolumeRocker
{
    public class HealthCheckController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetHealth() => Ok("healthy");
    }
}
