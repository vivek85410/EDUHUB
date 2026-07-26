using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Exceptions
{
    public class CourseException : Exception
    {
        public CourseException(string message) : base(message)
        {
        }
    }
}